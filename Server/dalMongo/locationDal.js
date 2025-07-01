const locationModel = require("../models/Location").Model;
// Create
async function addLocation(locationName, number, street, ward, district, city, country) {
    try {
        const newLocation = new locationModel({ locationName, number, street, ward, district, city, country });
        await newLocation.save();
        return { success: true, message: "Location added successfully" };
    } catch(error) {
        return { success: false, message: "Error adding location", error };
    }
}
// Read
async function findLocationByName(name) {
    return await locationModel.findOne({ locationName: name });
}

async function findLocationByCity(city) {
    return await locationModel.findOne({ City: city });
}
module.exports = {
    addLocation: addLocation,
    findLocationByName: findLocationByName, 
    findLocationByCity: findLocationByCity
}