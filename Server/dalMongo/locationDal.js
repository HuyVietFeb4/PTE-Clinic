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

async function getLocations(pathToFind, valuesToFind, pathToSort, sortDirection) {
    let aggregateStage = [];
    if(pathToFind.length > 0) {
        let filterObject = {};
        for (let i in pathToFind) {
            let fullPath;
            if (locationModel.schema.path(pathToFind[i])) {
                fullPath = pathToFind[i];
            } else {
                return { success: false, message: `Error at locationDal.js, no such path as ${pathToFind[i]}` };
            }
            filterObject[fullPath] = valuesToFind[i];
        }
        aggregateStage.push({ $match: filterObject });
    } 
    if(pathToSort.length > 0) {
        let sortObject = {};
        for (let i in pathToSort) {
            let fullPath;
            if (locationModel.schema.path(pathToSort[i])) {
                fullPath = pathToSort[i];
            } else {
                return { success: false, message: `Error at locationDal.js, no such path as ${pathToSort[i]}` };
            }
            sortObject[fullPath] = sortDirection[i];
        }
        aggregateStage.push({ $sort: sortObject });
    }
    try {
        const locations = await locationModel.aggregate(aggregateStage);
        return {success: true, message: 'Successfully retrieve locations info', data: locations};
    } catch(error) {
        throw new Error(`Error at locationDal.js, message: ${error.message}`);
    }
}  
module.exports = {
    addLocation: addLocation,
    findLocationByName: findLocationByName, 
    findLocationByCity: findLocationByCity,
    getLocations: getLocations
}