const locationDal = require("../dalMongo/locationDal");

async function addLocation(locationName, number, street, ward, district, city, country) {
    const location = await locationDal.findLocationByName(locationName);
    if(location) {
        return {success: false, message: "Location has already exists."};
    }
    const result = await locationDal.addLocation(locationName, number, street, ward, district, city, state, country);
    if (!result.success) {
        throw new Error(result.message);
    }

    return { success: true, message: "Add location successfully" };
}



module.exports = {
    addLocation: addLocation
};