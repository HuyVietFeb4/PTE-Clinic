const userDal = require("../dalMongo/userDal");
const jwt = require('../lib/util/jwt');
const crypto = require("crypto");

const locationDal = require('../dalMongo/locationDal');
const clinicDal = require('../dalMongo/clinicDal');

async function createSystemAdmin(email, username, password) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userDal.findUserByEmail(email);
    if(user) {
        return {success: false, message: "This email has already been registered. Try a new one"}
    }
    const result = await userDal.createSystemAdmin(email, username, hashedPassword);
    if (!result.success) {
        throw new Error(`Error at userActionLogic: ${result.message}`);
    }
    return { success: true, message: "Create system admin account successfully" };
}

async function login(email, password, clinicName) {
    if(clinicName === '') {
        const users = await userDal.findUsersByEmail(email);
        if (users.length === 1) {
            const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
            const user = await userDal.findUserByEmail(email, clinicName);
            if (!user) return { success: false, message: "User not found." };
            if (user.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
            if (user.password !== hashedPassword) {
                const resUpdate = await userDal.updateUserFailedLoginAttempByObject(user, false);
                if(!resUpdate.success) {
                    return resUpdate;
                }
                else {
                    return { success: false, message: resUpdate.message }
                }
            }
            const resUpdate = await userDal.updateUserFailedLoginAttempByObject(user, true);

            const payload = {
                username: user.username,
                id: user._id,
                email: email,
                accountStatus: user.accountStatus,
                role: user.role
            }

            if(user.role === 'clinicAdmin') {
                payload.clinicAdministeredID = user.clinicAdministeredID;
            }

            const token = await jwt.sign(payload);
            return { success: true, message: "Login successfully", token: token};
        }
        else {
            let clinicList = [];
            for(let user of users) {
                if(user.clinicAdministeredID) {
                    let clinic = await clinicDal.findClinicByID(user.clinicAdministeredID);
                    clinicList.push(clinic.clinicName);
                }
                else {
                    throw new Error('The role of user is not sufficient to use this feature');
                }
            }
            return { success: true, message: "Done stage one, going into stage 2", clinicList: clinicList};
        }
    }  else {
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        const admin = await userDal.findAdminWithClinicName(email, clinicName);
        if (!admin) return { success: false, message: "User not found." };
        if(admin.role !== 'clinicAdmin') return { success: false, message: 'User not found.' };
        if (admin.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
        if (admin.password !== hashedPassword) {
            const resUpdate = await userDal.updateUserFailedLoginAttempByObject(admin, false);
            if(!resUpdate.success) {
                return resUpdate;
            }
            else {
                return { success: false, message: resUpdate.message}
            }
        }
        const resUpdate = await userDal.updateUserFailedLoginAttempByObject(admin, true);
        // return token

        const payload = {
            username: admin.username,
            id: admin._id,
            email: email,
            accountStatus: admin.accountStatus,
            role: 'clinicAdmin',
            clinicAdministeredID: admin.clinicAdministeredID,
        }
        const token = await jwt.sign(payload);
        return { success: true, message: "Login successfully", token: token};
    }
    

}

async function clientLogin(email, password) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userDal.findUserByEmail(email);
    if (!user) return { success: false, message: "User not found." };
    if(user.role !== 'client') return { success: false, message: 'User not found.' };
    if (user.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
    if (user.password !== hashedPassword) {
        const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, false);
        if(!resUpdate.success) {
            return resUpdate;
        }
        else {
            return { success: false, message: resUpdate.message}
        }
    }
    const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, true);
    // return token

    const payload = {
        username: user.username,
        id: user._id,
        email: email,
        accountStatus: user.accountStatus,
        role: 'client',
    }
    const token = await jwt.sign(payload);
    return { success: true, message: "Login successfully", token: token};
}

async function adminLogin(email, password, clinicName) {
    // const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    // const adminList = await userDal.findAdmins(email);
    // for (adminAccount of adminList) {
    //     if(adminAccount.clinicAdministeredID?.clinicName === clinicName && adminAccount.role === 'clinicAdmin') {
    //         let isLoginSuccess = undefined;
    //         let returnObject = {};
    //         if (hashedPassword === adminAccount.password) {
    //             isLoginSuccess = true;
    //             const payload = {
    //                 username: adminAccount.username,
    //                 id: adminAccount._id,
    //                 email: email,
    //                 accountStatus: adminAccount.accountStatus,
    //                 role: 'clinicAdmin',
    //                 clinicAdministeredID: adminAccount.clinicAdministeredID,
    //             }
    //             const token = await jwt.sign(payload);
    //             returnObject = { success: true, message: "Login successfully", token: token};
    //         }
    //         else {
    //             isLoginSuccess = false;
    //         }
    //         const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, isLoginSuccess);
    //         if (!isLoginSuccess) {
    //             returnObject = { success: false, message: resUpdate.message};
    //         }
    //         if(!resUpdate.success) {
    //             return resUpdate;
    //         }
    //         else {
    //             return returnObject;
    //         }
    //     }
    // }
    // const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(adminAccount.email, false);
    // return { success: false, message: resUpdate.message};

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const admin = await userDal.findAdminWithClinicName(email, clinicName);
    if (!admin) return { success: false, message: "User not found." };
    if(admin.role !== 'clinicAdmin') return { success: false, message: 'User not found.' };
    if (admin.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
    if (admin.password !== hashedPassword) {
        const resUpdate = await userDal.updateUserFailedLoginAttempByObject(admin, false);
        if(!resUpdate.success) {
            return resUpdate;
        }
        else {
            return { success: false, message: resUpdate.message}
        }
    }
    const resUpdate = await userDal.updateUserFailedLoginAttempByObject(admin, true);
    // return token

    const payload = {
        username: admin.username,
        id: admin._id,
        email: email,
        accountStatus: admin.accountStatus,
        role: 'clinicAdmin',
        clinicAdministeredID: admin.clinicAdministeredID,
    }
    const token = await jwt.sign(payload);
    return { success: true, message: "Login successfully", token: token};
}

async function systemAdminLogin(email, password) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userDal.findUserByEmail(email);
    if (!user) return { success: false, message: "User not found." };
    if(user.role !== 'systemAdmin') return { success: false, message: 'User not found.' };
    if (user.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
    if (user.password !== hashedPassword) {
        const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, false);
        if(!resUpdate.success) {
            return resUpdate;
        }
        else {
            return { success: false, message: resUpdate.message}
        }
    }
    const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, true);
    // return token

    const payload = {
        username: user.username,
        id: user._id,
        email: email,
        accountStatus: user.accountStatus,
        role: 'systemAdmin',
    }
    const token = await jwt.sign(payload);
    return { success: true, message: "Login successfully", token: token};
}
async function signup(email, username, password, clinicName, role) {
    // Not yet sanitize
    const clinic = await clinicDal.findClinicByName(clinicName);
    if(!clinic) {
        throw new Error(`Clinic with name ${clinicName} does not exists`);
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    if (role === 'client') {
        const user = await userDal.findUserByEmail(email);
        if(user) {
            return {success: false, message: "This email has already been registered. Try a new one"}
        }
    }
    const result = await userDal.signup(email, username, hashedPassword, clinicName, role);
    if (!result.success) {
        throw new Error(`Error at userActionLogic: ${result.message}`);
    }
    return { success: true, message: "Signup successfully" };
}

async function addClientLocation(clientEmail, locationName, number, street, ward, district, city, state, country) {
    const location = await locationDal.findLocationByName(locationName);
    if(location) {
        return {success: false, message: "Location has already exists."};
    }
    const client = await userDal.findUserByEmail(clientEmail); 
    if(!client) {
        return {success: false, message: "Client does not exists."};
    }
    const result = await userDal.addClientLocation(clientEmail, locationName, number, street, ward, district, city, state, country);
    if (!result.success) {
        throw new Error(result.message);
    }
    return { success: true, message: "Add client's location successfully" };
}

async function getClient(clientEmail) {
    const client = await userDal.findClientByEmail(clientEmail);
    if(!client) {
        return {success: false, message: "No client found"}
    }
    return {success: true, message: "Retrieve client successfully", data: client}
}

async function getClientByID(clientID) {
    const client = await userDal.getClientByID(clientID);
    if(!client) {
        return {success: false, message: "No client found"}
    }
    return {success: true, message: "Retrieve client successfully", data: client}
}

async function getAdmins(adminEmail) {
    const admins = await userDal.findAdmins(adminEmail);
    if(!admins) {
        return {success: false, message: "No admins found"}
    }
    return {success: true, message: "Retrieve admins successfully", data: admins}
}

async function getAdmin(adminEmail, clinicName) {
    const admin = await userDal.findAdminWithClinicName(adminEmail, clinicName);
    if(!admin) {
        return {success: false, message: "No admin found"}
    }
    return {success: true, message: "Retrieve admin successfully", data: admin}
}

async function getUser(payload) {
    const user = await userDal.getUser(payload);
    if(!user) {
        return {success: false, message: "Can not get user information."}
    }
    return {success: true, message: "Retrieve user successfully", data: user}
}


async function getClients(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend, limit, skip) {
    const result = await userDal.getClients(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend, limit, skip);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function userReport() {
    const result = await userDal.userReport();
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateClient(clientEmail, pathToUpdate, valueToUpdate) {
    const client = await userDal.findUserByEmail(clientEmail);
    if(!client) {
        return {success: false, message: "Can not find the account"};
    }
    const result = await userDal.updateClient(clientEmail, pathToUpdate, valueToUpdate);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateClientClinicAttended(clientEmail, clinicNameToAdd, clinicNameToRemove) {
    const client = await userDal.findUserByEmail(clientEmail);
    if(!client) {
        return {success: false, message: "Can not find the account"};
    }
    if(client.role !== 'client') return { success: false, message: 'Can not update user' };
    const result = await userDal.updateClientClinicAttended(clientEmail, clinicNameToAdd, clinicNameToRemove);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateAdmin(adminEmail, clinicName, pathToUpdate, valueToUpdate) {
    const admin = await userDal.findAdminWithClinicName(adminEmail, clinicName);
    if(!admin) {
        return {success: false, message: "No admin found"}
    }
    if(admin.role !== 'clinicAdmin') return { success: false, message: 'Can not update user' };
    const result = await userDal.updateAdmin(adminEmail, clinicName, pathToUpdate, valueToUpdate);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateSystemAdmin(adminEmail, pathToUpdate, valueToUpdate) {
    const admin = await userDal.findUserByEmail(adminEmail);
    if(!admin) {
        return {success: false, message: "No admin found"}
    }
    if(admin.role !== 'systemAdmin') return { success: false, message: 'Can not update user' };
    const result = await userDal.updateSystemAdmin(adminEmail, pathToUpdate, valueToUpdate);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function changePasswordClient(clientEmail, oldPassword, newPassword) {
    const client = await userDal.findUserByEmail(clientEmail);
    if(!client) {
        return {success: false, message: "Can not find the account"};
    }
    const hashedPassword = crypto.createHash("sha256").update(oldPassword).digest("hex");
    if (hashedPassword !== client.password) {
        throw new Error('Invalid old password');
    }
    hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");
    const result = await userDal.changePasswordClient(clientEmail, oldPassword, hashedPassword);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function changePasswordAdmin(adminEmail, clinicName, oldPassword, newPassword) {
    const admin = await userDal.findAdminWithClinicName(adminEmail, clinicName);
    if(!admin) {
        return {success: false, message: "No admin found"}
    }
    const hashedPassword = crypto.createHash("sha256").update(oldPassword).digest("hex");
    if (hashedPassword !== admin.password) {
        throw new Error('Invalid old password');
    }
    hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");
    const result = await userDal.changePasswordAdmin(adminEmail, clinicName, oldPassword, hashedPassword);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function deleteClient(clientEmail) {
    const client = await userDal.findUserByEmail(clientEmail);
    if(!client) {
        return {success: false, message: "Can not find client to delete"};
    }
    const result = await userDal.deleteClientByEmail(clientEmail);
    if (!result.success) {
        throw new Error(result.message);
    }
    return { success: true, message: "Delete client successfully" };
}

async function deleteAdmin(adminEmail, clinicName) {
    const admin = await userDal.findAdminWithClinicName(adminEmail, clinicName);
    if(!admin) {
        return {success: false, message: "No admin found"}
    }
    const result = await userDal.deleteAdminByEmailAndClinicName(adminEmail, clinicName);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}
module.exports = {
    clientLogin: clientLogin,
    adminLogin: adminLogin,
    systemAdminLogin: systemAdminLogin,
    signup: signup,
    login: login,
    addClientLocation: addClientLocation,
    createSystemAdmin: createSystemAdmin,

    getClient: getClient,
    getClientByID: getClientByID,
    getAdmins: getAdmins,
    getAdmin: getAdmin,
    getClients: getClients,
    getUser: getUser,
    userReport: userReport,

    updateClient: updateClient,
    updateAdmin: updateAdmin,
    updateSystemAdmin: updateSystemAdmin,
    updateClientClinicAttended: updateClientClinicAttended,
    changePasswordClient: changePasswordClient,
    changePasswordAdmin: changePasswordAdmin,

    deleteClient: deleteClient,
    deleteAdmin: deleteAdmin
};