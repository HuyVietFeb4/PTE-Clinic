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
        id: user._id,
        email: email,
        role: 'client',
    }
    const token = await jwt.sign(payload);
    return { success: true, message: "Login successfully", token: token};
}

async function adminLogin(email, password, clinicName) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const adminList = await userDal.findAdmins(email);
    for (adminAccount of adminList) {
        if(adminAccount.clinicAdministeredID?.clinicName === clinicName && adminAccount.role === 'clinicAdmin') {
            let isLoginSuccess = undefined;
            let returnObject = {};
            console.log(hashedPassword);
            console.log(adminAccount.password);
            if (hashedPassword === adminAccount.password) {
                isLoginSuccess = true;
                const payload = {
                    id: adminAccount._id,
                    email: email,
                    role: 'clinicAdmin',
                }
                const token = await jwt.sign(payload);
                returnObject = { success: true, message: "Login successfully", token: token};
            }
            else {
                isLoginSuccess = false;
            }
            const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(email, isLoginSuccess);
            if (!isLoginSuccess) {
                returnObject = { success: false, message: resUpdate.message};
            }
            if(!resUpdate.success) {
                return resUpdate;
            }
            else {
                return returnObject;
            }
        }
    }
    const resUpdate = await userDal.updateUserFailedLoginAttempByEmail(adminAccount.email, false);
    return { success: false, message: resUpdate.message};
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
        id: user._id,
        email: email,
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


async function getClients(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
    const result = await userDal.getClients(pathToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend);
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
    const result = await userDal.updateAdmin(adminEmail, clinicName, pathToUpdate, valueToUpdate);
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
    addClientLocation: addClientLocation,
    createSystemAdmin: createSystemAdmin,

    getClient: getClient,
    getAdmins: getAdmins,
    getAdmin: getAdmin,
    getClients: getClients,

    updateClient: updateClient,
    updateAdmin: updateAdmin,
    updateClientClinicAttended: updateClientClinicAttended,
    changePasswordClient: changePasswordClient,
    changePasswordAdmin: changePasswordAdmin,

    deleteClient: deleteClient,
    deleteAdmin: deleteAdmin
};