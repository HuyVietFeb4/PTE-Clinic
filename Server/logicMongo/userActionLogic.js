const userDal = require("../dalMongo/userDal");

const crypto = require("crypto");

async function clientLogin(email, password) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userDal.findUserByEmail(email);
    if (user.failedLoginAttemps > 5) return {success: false, message: "User is locked. Please contact support."};
    if (!user) return { success: false, message: "User not found." };
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

    return { success: true, message: "Login successfully"};
}

async function adminLogin(email, password, clinicName) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const adminList = await userDal.findUserByEmail(email);
    for (adminAccount in adminList) {
        if(adminAccount.clinicAdministered.clinicName === clinicName) {
            let isLoginSuccess = undefined;
            let returnObject = {};
            if (hashedPassword === adminAccount.password) {
                isLoginSuccess = true;
                returnObject = { success: true, message: "Login successfully"};
            }
            else {
                isLoginSuccess = false;
                returnObject = { success: false, message: resUpdate.message};
            }
            const resUpdate = await userDal.updateUserFailedLoginAttempByObject(adminAccount, isLoginSuccess);
            if(!resUpdate.success) {
                return resUpdate;
            }
            else {
                return returnObject;
            }
        }
    }
    return { success: false, message: "Login unsuccessfully"};
}

async function signup(email, username, password, role) {
    // Not yet sanitize
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    if (role === 'client') {
        const user = await userDal.findUserByEmail(email);
        if(user) {
            return {success: false, message: "This email has already been registered. Try a new one"}
        }
    }
    const result = await userDal.saveUserByEmail(email, username, hashedPassword, role);
    if (!result.success) {
        throw new Error(result.message);
    }
    return { success: true, message: "Signup successfully" };
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


async function getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
    const result = await userDal.getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend);
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
module.exports = {
    clientLogin: clientLogin,
    adminLogin: adminLogin,
    signup: signup,
    
    getClient: getClient,
    getAdmins: getAdmins,
    getAdmin: getAdmin,
    getClients: getClients,

    updateClient: updateClient,
    updateAdmin: updateAdmin,
    updateClientClinicAttended: updateClientClinicAttended
};