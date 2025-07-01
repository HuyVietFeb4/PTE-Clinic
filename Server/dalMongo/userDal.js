const { get } = require("mongoose");
const { use } = require("react");

const userModel = require("../models/user.js").Model;
const clientModel = require('../models/client.js').Model;
const adminModel = require('../models/admin.js').Model;
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

async function findUserByEmail(email) {
    return await userModel.findOne({ email: Email });
}

async function findAdminsByEmail(Email) { // Only use for admin
    return await userModel.find({ email: Email }).populate({
        path: clinicAdministered,
        populate: {
            path: location
        }
    }); 
}

async function findAdminsByEmail(Email) { // Only use for admin
    return await userModel.find({ email: Email }).populate({
        path: clinicAdministered,
        populate: {
            path: location
        }
    }); 
}

async function findClientByEmail(email) {
    return await userModel.findOne(email).populate([
        {
        path: clinicAttended,
        populate: {
            path: location
        }
        },
        {
            path: location
        }
    ])
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
//delete

module.exports = {
    signup: signup,

    findUserByUsername: findUserByUsername, 
    findUserByEmail: findUserByEmail,
    findAdminsByEmail: findAdminsByEmail,
    findClientByEmail: findClientByEmail,

    updateUserFailedLoginAttempByEmail: updateUserFailedLoginAttempByEmail,
};