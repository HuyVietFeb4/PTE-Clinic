const locationModel = require("../models/location").Model;
const clinicModel = require("../models/clinic").Model;
const clientModel = require('../models/client').Model;

const locationDal = require("./locationDal");
const userDal = require("./userDal");
// Create
async function addClinic(ClinicName, locationName) {
    try {
        const newClinic = new clinicModel({ clinicName: ClinicName });
        const clinicLocation = locationDal.findLocationByName(locationName);
        newClinic.clientLocationID = clinicLocation._id;
        await newClinic.save();
        return { success: true, message: "Clinic added successfully" };
    } catch(error) {
        return { success: false, message: "Error adding Clinic", error };
    }
}
// Read
async function findClinicByName(name) {
    return await clinicModel.findOne({ clinicName: name });
}

async function findClinicByNameWithFullInfo(name) {
    return await clinicModel.findOne({ clinicName: name }).populate([
        {
            path: clinicLocationID
        },
        {
            path: clientAttendedIDs,
            populate: {
                path: clientLocationID
            }
        }
    ]);
}

async function getClinics(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees) {
    let aggregateStage = [];
    if (getLocation) {
        aggregateStage.push(
            {
                $lookup: {
                    from: 'location',
                    localField: 'clinicLocationID',
                    foreignField: '_id',
                    as: 'clinicLocation',
                }
            }
        );
        // aggregateStage.push({ $unwind: '$clientLocation' }); maybe not needed
    }
    if (getClientAttendees) {
        aggregateStage.push(
            {
                $lookup: {
                    from: 'client',
                    localField: 'clientAttendedIDs',
                    foreignField: '_id',
                    as: 'clientAttendeds',
                }
            }
        );
        aggregateStage.push({ $unwind: '$clientAttendeds' });
    }
    if(pathToFind.length > 0) {
        let filterObject = {};
        for (let i in pathToFind) {
            let fullPath;
            if (clinicModel.schema.path(pathToFind[i])) {
                fullPath = pathToFind[i];
            } else if (locationModel.schema.path(pathToFind[i])) {
                fullPath = `clinicLocation.${pathToFind[i]}`;
            } else if (clientModel.schema.path(pathToFind[i])) {
                fullPath = `clientAttendeds.${pathToFind[i]}`;
            } else {
                return { success: false, message: `Error at clinicDal.js, no such path as ${pathToFind[i]}` };
            }
            filterObject[fullPath] = valuesToFind[i];
        }
        aggregateStage.push({ $match: filterObject });
    }
    if(pathToSort.length > 0) {
        let sortObject = {};
        for (let i in pathToSort) {
            let fullPath;
            if (clinicModel.schema.path(pathToSort[i])) {
                fullPath = pathToSort[i];
            } else if (locationModel.schema.path(pathToSort[i])) {
                fullPath = `clinicLocation.${pathToSort[i]}`;
            } else if (clientModel.schema.path(pathToSort[i])) {
                fullPath = `clientAttendeds.${pathToSort[i]}`;
            } else {
                return { success: false, message: `Error at clinicDal.js, no such path as ${pathToSort[i]}` };
            }
            sortObject[fullPath] = sortDirection[i];
        }
        aggregateStage.push({ $sort: sortObject });
    }
    try {
        const clinics = await clinicModel.aggregate(aggregateStage);
        return {success: true, message: 'Successfully retrieve clinic info', data: clinics};
    } catch(error) {
        throw new Error(`Error at clinicDal.js, message: ${error.message}`);
    }
}

async function updateClinic(clinicName, pathToUpdate, valueToUpdate) { // maybe limit to not use for update clinic attended
    let clinic = await findClinicByNameWithFullInfo(clinicName);
    if (pathToUpdate.length > 0 && valueToUpdate.length > 0) {
        for (let i in pathToUpdate) { 
            if(['clientAttendedIDs'].includes(pathToUpdate[i]) ) {
                throw new Error(`Can not update this path ${pathToUpdate[i]} with this api call`);
            }
            else if (typeof(valueToUpdate[i]) === typeof(clinic[pathToUpdate[i]])) {
                clinic[pathToUpdate[i]] = valueToUpdate[i];
            }
            else if (valueToUpdate[i].includes('{') && typeof(clinic[pathToUpdate[i]]) === 'object') {
                clinic[pathToUpdate[i]] = JSON.parse(valueToUpdate[i]);
            }
            else {
                throw new Error(`${pathToUpdate[i]} and ${valueToUpdate[i]} is not the same type`);
            }   
        }
    }
    else {
        throw new Error("Invalid length");
    }
    await clinic.save();
    return {success: true, message: 'Successfully update clinic'};
}

async function updateClinicClientAttendee(clinicName, clientEmailToAdd, clientEmailToRemove) {
    let clinic = await findClinicByName(clinicName);
    for (let i in clientEmailToAdd) {
        let client = await userDal.findUserByEmail(clientEmailToAdd[i]);
        if(!client) {
            throw new Error(`There is no such client with the email: ${clientEmailToAdd[i]}`);
        } else if(clinic.clientAttendedIDs.includes(client._id)) {
            throw new Error(`This client has already been added: ${client.email}`);
        }
        else {
            clinic.clientAttendedIDs.push(client._id);
        }
    }
    for (let i in clientEmailToRemove) {
        let client = await userDal.findUserByEmail(clientEmailToRemove[i]);
        if(!client) {
            throw new Error(`There is no such clinic with the email: ${clientEmailToRemove[i]}`);
        }
        else {
            const index = clinic.clientAttendedIDs.indexOf(client._id);
            if (index > -1) {
                clinic.clientAttendedIDs.splice(index, 1); 
            }
            else {
                throw new Error(`This client does not in clinic\'s attendees list to be removed: ${client.email}`);
            }
        }
    }
    await client.save();
    return {success: true, message: 'Successfully update clinic\'s client attendedees list '};
}
module.exports = {
    addClinic: addClinic,

    findClinicByName: findClinicByName, 
    findClinicByNameWithFullInfo: findClinicByNameWithFullInfo,
    getClinics: getClinics,

    updateClinic: updateClinic,
    updateClinicClientAttendee: updateClinicClientAttendee
}