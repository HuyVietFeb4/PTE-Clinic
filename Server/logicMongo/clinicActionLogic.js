const clinicDal = require("../dalMongo/locationDal");

async function addClinic(clinicName, locationName) {
    const clinic = await clinicDal.findClinicByName(clinicName);
    if(clinic) {
        return {success: false, message: "Clinic has already exists."};
    }
    const result = await clinicDal.addClinic(clinicName, locationName);
    if (!result.success) {
        throw new Error(result.message);
    }

    return { success: true, message: "Add clinic successfully" };
}

module.exports = {
    addClinic: addClinic
};