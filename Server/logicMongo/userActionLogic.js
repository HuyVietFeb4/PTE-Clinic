const userDal = require("../dalMongo/userDal");
const crypto = require("crypto");

async function login(email, password, role) {
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userRetrieveInfo.findUserByEmail(email);
    if (user.role !== role) {
        return {success: false, message: 'Conflict in role'};
    }
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

async function signup(email, username, password, role) {
    // Not yet sanitize
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userRetrieveInfo.findUserByEmail(email);
    if(user) {
        return {success: false, message: "This email has already been registered. Try a new one"}
    }
    const result = await userDal.saveUserByEmail(email, username, hashedPassword, role);
    if (!result.success) {
        throw new Error(result.message);
    }
    return { success: true, message: "Signup successfully" };
}
module.exports = {
    login: login,
    signup: signup
};