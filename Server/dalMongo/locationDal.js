const locationModel = require("../models/location").Model;
// Create
async function addLocation(locationName, number, street, ward, district, city, state, country) {
    try {
        const newLocation = new locationModel({ locationName, number, street, ward, district, city, state, country });
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

async function findLocationByCity(City) {
    return await locationModel.findOne({ city: City });
}
module.exports = {
    addLocation: addLocation,
    findLocationByName: findLocationByName, 
    findLocationByCity: findLocationByCity
}