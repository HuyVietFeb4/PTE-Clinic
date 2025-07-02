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

async function getClinics(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees) {
    const result = await clinicDal.getClinics(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateClinic(clinicName, pathToUpdate, valueToUpdate) {
    const clinic = await clinicDal.findClinicByName(clinicName);
    if(!clinic) {
        return {success: false, message: "Can not find the clinic"};
    }
    const result = await clinicDal.updateClient(clinicName, pathToUpdate, valueToUpdate);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

module.exports = {
    addClinic: addClinic,
    getClinics: getClinics,
    updateClinic: updateClinic
};