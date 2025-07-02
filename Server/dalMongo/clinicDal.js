const locationModel = require("../models/location").Model;
const clinicModel = require("../models/clinic").Model;
const clientModel = require('../models/client').Model;

const locationDal = require("./locationDal")
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

async function getClinics(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees) {
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
    if(pathsToFind.length > 0) {
        let filterObject = {};
        for (let i in pathsToFind) {
            let fullPath;
            if (userModel.schema.path(pathsToFind[i])) {
                fullPath = pathsToFind[i];
            } else if (locationModel.schema.path(pathsToFind[i])) {
                fullPath = `clinicLocation.${pathsToFind[i]}`;
            } else if (clientModel.schema.path(pathsToFind[i])) {
                fullPath = `clientAttendeds.${pathsToFind[i]}`;
            } else {
                return { success: false, message: `Error at clinicDal.js, no such path as ${pathsToFind[i]}` };
            }
            filterObject[fullPath] = valuesToFind[i];
        }
        aggregateStage.push({ $match: filterObject });
    }
    if(pathToSort.length > 0) {
        let sortObject = {};
        for (let i in pathToSort) {
            let fullPath;
            if (userModel.schema.path(pathToSort[i])) {
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
        const clinics = await userModel.aggregate(aggregateStage);
        return {success: true, message: 'Successfully retrieve client info', data: clinics};
    } catch(error) {
        throw new Error(`Error at userDal.js, message: ${error.message}`);
    }
}

module.exports = {
    addClinic: addClinic,
    findClinicByName: findClinicByName, 
    getClinics: getClinics
}