const locationDal = require("../dalMongo/locationDal");

async function addLocation(locationName, number, street, ward, district, city, state, country) {
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

async function getLocations(pathToFind, valuesToFind, pathToSort, sortDirection) {
    const result = await locationDal.getLocations(pathToFind, valuesToFind, pathToSort, sortDirection);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}

async function updateLocation(locationName, pathToUpdate, valueToUpdate) {
    const location = await locationDal.findLocationByName(locationName);
    if(!location) {
        return {success: false, message: "Can not find the location"};
    }
    const result = await locationDal.updateClient(locationName, pathToUpdate, valueToUpdate);
    if (!result.success) {
        throw new Error(result.message);
    }
    return result;
}
module.exports = {
    addLocation: addLocation,
    getLocations: getLocations,
    updateLocation: updateLocation
};