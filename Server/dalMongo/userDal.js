const { get } = require("mongoose");
const { use } = require("react");

const userModel = require("../models/user.js").Model;
const clientModel = require('../models/client.js').Model;
const adminModel = require('../models/admin.js').Model;
const locationModel = require('../models/location.js').Model;
const clinicModel = require('../models/clinic.js').Model;
//create
async function signup(Email, Username, Password, Role) {
    try {
        let newUser;
        if (Role === 'client') {
            newUser = new clientModel({ email: Email, username: Username, password: Password, role: Role });
        }
        else {
            newUser = new adminModel({ email: Email, username: Username, password: Password, role: Role });
        }
        await newUser.save();
        return { success: true, message: "User saved successfully" };
    } catch(error) {
        return { success: false, message: "Error saving user", error };
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
            path: clinicAdministeredID,
            populate: {
                path: clinicLocationID
            }
        }); 
    }
    return await userModel.find({ email: adminEmail }).populate({
        path: clinicAdministeredID,
        populate: {
            path: clinicLocationID
        }
    }); 
}

async function findClientByEmail(clientEmail) {
    return await userModel.findOne({ email: clientEmail }).populate([
        {
        path: clinicAttendedIDs,
        populate: {
            path: clinicLocationID
        }
        },
        {
            path: clientLocationID
        }
    ])
}

async function getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
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
                    localField: 'clinicAttendedIDs',
                    foreignField: '_id',
                    as: 'clinicAttended',
                }
            }
        );
        aggregateStage.push({ $unwind: '$clinicAttended' });
    }
    if(pathsToFind.length > 0) {
        let filterObject = {};
        for (let i in pathsToFind) {
            let fullPath;
            if (userModel.schema.path(pathsToFind[i])) {
                fullPath = pathsToFind[i];
            } else if (locationModel.schema.path(pathsToFind[i])) {
                fullPath = `clientLocation.${pathsToFind[i]}`;
            } else if (clinicModel.schema.path(pathsToFind[i])) {
                fullPath = `clinicAttended.${pathsToFind[i]}`;
            } else {
                return { success: false, message: `Error at userDal.js, no such path as ${pathsToFind[i]}` };
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
            message: `Error updating user: ${error.message || error.toString()}`
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
//delete

module.exports = {
    signup: signup,

    findUserByUsername: findUserByUsername, 
    findUserByEmail: findUserByEmail,
    findAdmins: findAdmins,
    findClientByEmail: findClientByEmail,
    getClients: getClients,

    updateUserFailedLoginAttempByEmail: updateUserFailedLoginAttempByEmail,
    updateUserFailedLoginAttempByObject: updateUserFailedLoginAttempByObject
};