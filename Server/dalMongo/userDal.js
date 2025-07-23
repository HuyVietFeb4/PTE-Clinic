const { get } = require("mongoose");

const userModel = require("../models/user.js").Model;
const clientModel = require('../models/client.js').Model;
const adminModel = require('../models/admin.js').Model;
const locationModel = require('../models/location.js').Model;
const clinicModel = require('../models/clinic.js').Model;

const clinicDal = require('./clinicDal.js');
const locationDal = require("./locationDal.js");
//create
async function createSystemAdmin(Email, Username, Password) {
    try {
        const newSysAdmin = new adminModel({ email: Email, username: Username, password: Password, role: 'systemAdmin'});
        await newSysAdmin.save();
    } catch(error) {
        return { success: false, message: `Error at userDal.js, message: ${error.message}` };
    }
}

async function signup(Email, Username, Password, clinicName, Role) {
    try {
        let newUser;
        const clinic = await clinicDal.findClinicByName(clinicName);
        if (Role === 'client') {
            newUser = new clientModel({ email: Email, username: Username, password: Password, role: Role, clientAttendedID: clinic._id });
        }
        else {
            newUser = new adminModel({ email: Email, username: Username, password: Password, role: Role, clinicAdministeredID: clinic._id });
        }
        await newUser.save();
        return { success: true, message: "User saved successfully" };
    } catch(error) {
        return { success: false, message: `Error at userDal.js, message: ${error.message}` };
    }
}


async function addClientLocation(clientEmail, locationName, number, street, ward, district, city, state, country) {
    try {
        const newLocation = new locationModel({ locationName, number, street, ward, district, city, state, country });
        await newLocation.save();
        const client = await findUserByEmail(clientEmail); 
        client.clientLocationID = newLocation._id;
        await client.save();
    } catch(error) {
        return { success: false, message: `Error at userDal.js, message: ${error.message}` };
    }
}
//read
async function findUserByUsername(Username) {
    return await userModel.findOne({ username: Username });
}

async function findUserByEmail(Email) {
    return await userModel.findOne({ email: Email });
}

async function findAdmins(adminEmail) { // Only use for admin
    if (adminEmail === '') {
        return await userModel.find().populate({
            path: 'clinicAdministeredID',
            populate: {
                path: 'clinicLocationID'
            }
        }); 
    }
    return await userModel.find({ email: adminEmail }).populate({
        path: clinicAdministeredID,
        populate: {
            path: 'clinicLocationID'
        }
    }); 
}

async function findAdminWithClinicName(adminEmail, ClinicName) {
    const clinic = await clinicModel.findOne({ clinicName: ClinicName });
    if(!clinic) {
        throw new error(`Can not find clinic with clinic name: ${ClinicName}`)
    }
    const admin = await userModel.findOne({ email: adminEmail, clinicAdministeredID: clinic._id });
    if(!admin) {
        throw new error(`Can not find admin with email: ${adminEmail} and clinic name: ${ClinicName}`)
    }
    return admin;
}

async function findClientByEmail(clientEmail) {
    return await userModel.findOne({ email: clientEmail }).populate([
        {
        path: 'clinicAttendedID',
        populate: {
            path: 'clinicLocationID'
        }
        },
        {
            path: 'clientLocationID'
        }
    ])
}

async function getClients(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
    let aggregateStage = [];
    if (getLocation) {
        aggregateStage.push(
            {
                $lookup: {
                    from: 'location',
                    localField: 'clientLocationID',
                    foreignField: '_id',
                    as: 'clientLocation',
                }
            }
        );
        // aggregateStage.push({ $unwind: '$clientLocation' }); maybe not needed
    }
    if (getClinicAttend) {
        aggregateStage.push(
            {
                $lookup: {
                    from: 'clinic',
                    localField: 'clinicAttendedID',
                    foreignField: '_id',
                    as: 'clinicAttended',
                }
            }
        );
        // aggregateStage.push({ $unwind: '$clinicAttended' }); client can only attend 1 clinic
    }
    if(pathToFind.length > 0) {
        let filterObject = {};
        for (let i in pathToFind) {
            let fullPath;
            if (userModel.schema.path(pathToFind[i])) {
                fullPath = pathToFind[i];
            } else if (locationModel.schema.path(pathToFind[i])) {
                fullPath = `clientLocation.${pathToFind[i]}`;
            } else if (clinicModel.schema.path(pathToFind[i])) {
                fullPath = `clinicAttended.${pathToFind[i]}`;
            } else {
                return { success: false, message: `Error at userDal.js, no such path as ${pathToFind[i]}` };
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
                fullPath = `clientLocation.${pathToSort[i]}`;
            } else if (clinicModel.schema.path(pathToSort[i])) {
                fullPath = `clinicAttended.${pathToSort[i]}`;
            } else {
                return { success: false, message: `Error at userDal.js, no such path as ${pathToSort[i]}` };
            }
            sortObject[fullPath] = sortDirection[i];
        }
        aggregateStage.push({ $sort: sortObject });
    }
    try {
        const clients = await userModel.aggregate(aggregateStage);
        return {success: true, message: 'Successfully retrieve client info', data: clients};
    } catch(error) {
        throw new Error(`Error at userDal.js, message: ${error.message}`);
    }
}
//update
async function updateUserFailedLoginAttempByEmail(email, successLogin) {
    const maxAttempts = 5;
    try {
        if (successLogin) {
            await userModel.findOneAndUpdate({ Email: email }, {failedLoginAttemps: 0});
            return { success: true, message: "Update user login attempt successfully"};
        } else {
            const targetUser = await userModel.findOne({ Email: email });
            const failedAttemps = targetUser.failedLoginAttemps;
            if ( failedAttemps > 5 && Math.floor((Date.now() - targetUser.lastFailedLogin) / 86400000) > 7 ) {
                await userModel.findOneAndUpdate({ Email: email }, {lastFailedLogin: new Date(), failedLoginAttemps: 1});
                return {success: true, message: `Login failed, you have ${maxAttempts-1} attempts left`};
            }
            else {
                await userModel.findOneAndUpdate({ Email: email }, {lastFailedLogin: new Date(), failedLoginAttemps: failedAttemps + 1});
                return {success: true, message: `Login failed, you have ${maxAttempts - failedAttemps} attempts left`};
            } 
        }
    } catch(error) {
        return {
            success: false,
            message: `Error updating user: ${error.message}`
        };
    }
}

async function updateUserFailedLoginAttempByObject(userObject, successLogin) {
    const maxAttempts = 5;
    try {
        if (successLogin) {
            userObject.failedLoginAttemps = 0;
            await userObject.save();
            return { success: true, message: "Update user login attempt successfully"};
        } else {
            const targetUser = await userModel.findOne({ Email: email });
            const failedAttemps = targetUser.failedLoginAttemps;
            if ( failedAttemps > 5 && Math.floor((Date.now() - targetUser.lastFailedLogin) / 86400000) > 7 ) {
                userObject.lastFailedLogin = new Date();
                userObject.failedLoginAttemps = 1;
                await userObject.save();
                return {success: true, message: `Login failed, you have ${maxAttempts-1} attempts left`};
            }
            else {
                userObject.lastFailedLogin = new Date();
                userObject.failedLoginAttemps = failedAttemps + 1;
                await userObject.save();
                return {success: true, message: `Login failed, you have ${maxAttempts - failedAttemps} attempts left`};
            } 
        }
    } catch(error) {
        return {
            success: false,
            message: `Error updating user: ${error.message || error.toString()}`
        };
    }
}

async function updateClient(clientEmail, pathToUpdate, valueToUpdate) {
    let client = await findClientByEmail(clientEmail);
    if (pathToUpdate.length > 0 && valueToUpdate.length > 0) {
        for (let i in pathToUpdate) { 
            if(['lastFailedLogin', 'failedLoginAttemps', 'email'].includes(pathToUpdate[i]) ) {
                throw new Error(`Can not update this path ${pathToUpdate[i]} with this api call`);
            }
            else if (typeof(valueToUpdate[i]) === typeof(client[pathToUpdate[i]])) {
                client[pathToUpdate[i]] = valueToUpdate[i];
            }
            else if (valueToUpdate[i].includes('{') && typeof(client[pathToUpdate[i]]) === 'object') {
                client[pathToUpdate[i]] = JSON.parse(valueToUpdate[i]);
            }
            else if (pathToUpdate[i] === 'clientLocationID') {
                let location = locationDal.findLocationByName(valueToUpdate[i]);
                if(!location) {
                    throw new Error('Can not find location to update client\'s location');
                }
                client[pathToUpdate[i]] = location._id;
            }
            else if (pathToUpdate[i] === 'clinicAttendedID') {
                let clinic = clinicDal.findClinicByName(valueToUpdate[i]);
                if(!clinic) {
                    throw new Error('Can not find clinic to update client\'s clinic attended');
                }
                client[pathToUpdate[i]] = clinic._id;
            }
            else {
                throw new Error(`${pathToUpdate[i]} and ${valueToUpdate[i]} is not the same type`);
            }   
        }
    }
    else {
        throw new Error("Invalid length");
    }
    await client.save();
    return {success: true, message: 'Successfully update client'};
}

async function updateClientClinicAttended(clientEmail, clinicNameToAdd, clinicNameToRemove) { // DONT USE THIS
    let client = await findUserByEmail(clientEmail);
    for (let i in clinicNameToAdd) {
        let clinic = await clinicDal.findClinicByName(clinicNameToAdd[i]);
        if(!clinic) {
            throw new Error(`There is no such clinic with the name: ${clinicNameToAdd[i]}`);
        } else if(client.clinicAttendedID.includes(clinic._id)) {
            throw new Error(`This clinic has already been added: ${clinic.clinicName}`);
        }
        else {
            client.clinicAttendedID.push(clinic._id);
        }
    }
    for (let i in clinicNameToRemove) {
        let clinic = await clinicDal.findClinicByName(clinicNameToAdd[i]);
        if(!clinic) {
            throw new Error(`There is no such clinic with the name: ${clinicNameToAdd[i]}`);
        }
        else {
            const index = client.clinicAttendedID.indexOf(clinic._id);
            if (index > -1) {
                client.clinicAttendedID.splice(index, 1); 
            }
            else {
                throw new Error(`This clinic does not in client attended list to be removed: ${clinic.clinicName}`);
            }
        }
    }
    await client.save();
    return {success: true, message: 'Successfully update client\'s clinic attended list '};
}

async function updateAdmin(adminEmail, clinicName, pathToUpdate, valueToUpdate) {
    let admin = await findAdminWithClinicName(adminEmail, clinicName);

    if (pathToUpdate.length > 0 && valueToUpdate.length > 0) {
        for (let i in pathToUpdate) { 
            if(['lastFailedLogin', 'failedLoginAttemps', 'email'].includes(pathToUpdate[i]) ) {
                throw new Error(`Can not update this path ${pathToUpdate[i]} with this api call`);
            }
            else if (typeof(valueToUpdate[i]) === typeof(admin[pathToUpdate[i]])) {
                admin[pathToUpdate[i]] = valueToUpdate[i];
            }
            else if (valueToUpdate[i].includes('{') && typeof(admin[pathToUpdate[i]]) === 'object') {
                admin[pathToUpdate[i]] = JSON.parse(valueToUpdate[i]);
            }
            else if (pathToUpdate[i] === 'clinicAdministeredID') {
                let clinic = clinicDal.findClinicByName(valueToUpdate[i]);
                if(!clinic) {
                    throw new Error('Can not find clinic to update admin\'s clinic administered');
                }
                admin[pathToUpdate[i]] = clinic._id;
            }
            else {
                throw new Error(`${pathToUpdate[i]} and ${valueToUpdate[i]} is not the same type`);
            }   
        }
    }
    else {
        throw new Error("Invalid length");
    }
    await admin.save();
    return {success: true, message: 'Successfully update client'};
}
//delete

async function deleteClientByEmail(clientEmail) {
    try {
        const client = await findUserByEmail(clientEmail);
        const clientID = client._id;
        const clientLocationID = client.clientLocationID;
        const clinicAttendedID = client.clinicAttendedID;
        const clinic = clinicModel.findById(clinicAttendedID);

        await clientModel.findByIdAndDelete(clientID); 
        await locationModel.findByIdAndDelete(clientLocationID);
        clinic.clientAttendedIDs.pull(clientID);
        await clinic.save();
        return { success: true, message: 'Delete client successfully' };
    }
    catch(error) {
        return { success: false, message: `Error at userDal.js, message: ${error.message}`};
    }
}

async function deleteAdminByEmailAndClinicName(adminEmail, ClinicName) {
    try {
        const clinic = await clinicModel.findOne({ clinicName: ClinicName });
        await adminModel.deleteOne({ email: adminEmail, clinicAdministeredID: clinic._id });
        return { success: true, message: 'Delete admin successfully'};
    } catch(error) {
        return { success: false, message: `Error at userDal.js, message: ${error.message}`};
    }
    
}
module.exports = {
    signup: signup,
    addClientLocation: addClientLocation,
    createSystemAdmin: createSystemAdmin,

    findUserByUsername: findUserByUsername, 
    findUserByEmail: findUserByEmail,
    findAdmins: findAdmins,
    findAdminWithClinicName: findAdminWithClinicName,
    findClientByEmail: findClientByEmail,
    getClients: getClients,

    updateAdmin: updateAdmin,
    updateUserFailedLoginAttempByEmail: updateUserFailedLoginAttempByEmail,
    updateUserFailedLoginAttempByObject: updateUserFailedLoginAttempByObject,
    updateClient: updateClient,
    updateClientClinicAttended: updateClientClinicAttended,

    deleteClientByEmail: deleteClientByEmail,
    deleteAdminByEmailAndClinicName: deleteAdminByEmailAndClinicName
};