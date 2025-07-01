const locationModel = require("../models/location").Model;
const clinicModel = require("../models/clinic").Model;

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


module.exports = {
    addClinic: addClinic,
    findClinicByName: findClinicByName, 
}