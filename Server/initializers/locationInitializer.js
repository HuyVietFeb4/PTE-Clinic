const { Initializer, api } = require('actionhero');
const locationActionLogic = require('../logicMongo/locationActionLogic');
module.exports = class locationInitializer extends Initializer {
    constructor() {
        super();
        this.name = 'location';
    }

    async initialize() {
        api.location = {};

        api.location.addLocation = async function (locationName, number, street, ward, district, city, state, country) { 
            return await locationActionLogic.addLocation(locationName, number, street, ward, district, city, state, country);
        };

        api.location.getLocations = async function (pathToFind, valuesToFind, pathToSort, sortDirection) {
            // pathToFind: a list, what path to find for the client
            // valuesToFind: a list, values that system based on to find client
            // pathToFind and valuesToFind must be the same length
            if (pathToFind.length !== valuesToFind.length) {
                throw new Error('pathToFind and valuesToFind must be the same length');
            }

            // pathToSort: a list, name of the path that the system will base on and sort the result
            // sortDirection: a list, value are 1 or -1
            if (pathToSort.length !== sortDirection.length) {
                throw new Error('pathToSort and sortDirection must be the same length');
            }
            return await locationActionLogic.getLocations(pathToFind, valuesToFind, pathToSort, sortDirection);
        }

        api.location.updateLocation = async function (locationName, pathToUpdate, valueToUpdate) {
            if (pathToUpdate.length !== valueToUpdate.length) {
                throw new Error('pathToUpdate and valueToUpdate must be the same length');
            }
            if (pathToUpdate.length === 0 || valueToUpdate.length === 0) {
                throw new Error('Must have at least 1 path and value to update');
            }
            return await locationActionLogic.updateLocation(locationName, pathToUpdate, valueToUpdate);
        }
    }
}