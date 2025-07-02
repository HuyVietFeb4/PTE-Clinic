const { Initializer, api } = require('actionhero');
const clinicActionLogic = require('../logicMongo/clinicActionLogic');
module.exports = class clinicInitializer extends Initializer {
    constructor() {
        super();
        this.name = 'clinic';
    }

    async initialize() {
        api.clinic = {};

        api.clinic.addClinic = async function (clinicName, locationName) { 
            return await clinicActionLogic.addClinic(clinicName, locationName);
        };

        api.clinic.getClinics = async function(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees) {
            // pathsToFind: a list, what path to find for the client
            // valuesToFind: a list, values that system based on to find client
            // pathsToFind and valuesToFind must be the same length
            if (pathsToFind.length !== valuesToFind.length) {
                throw new Error('pathsToFind and valuesToFind must be the same length');
            }

            // pathToSort: a list, name of the path that the system will base on and sort the result
            // sortDirection: a list, value are 1 or -1
            if (pathToSort.length !== sortDirection.length) {
                throw new Error('pathToSort and sortDirection must be the same length');
            }
            if (!getLocation && !getClientAttendees) {
                throw new Error('at least one of getLocation and getClientAttendees must be true');
            }
            // Return: a list of clients with relevent clinics attended and location documents
            return await clinicActionLogic.getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClientAttendees);
        }

        api.clinic.updateClinic = async function(clinicName, pathToUpdate, valueToUpdate) {
            if (pathToUpdate.length !== valueToUpdate.length) {
                throw new Error('pathToUpdate and valueToUpdate must be the same length');
            }
            if (pathToUpdate.length === 0 || valueToUpdate.length === 0) {
                throw new Error('Must have at least 1 path and value to update');
            }
            return await clinicActionLogic.updateClinic(clinicName, pathToUpdate, valueToUpdate);
        }

        api.clinic.updateClinicClientAttendee = async function(clinicName, clientEmailToAdd, clientEmailToRemove) {
            if (clientEmailToAdd.length === 0 && clientEmailToRemove.length === 0) {
                throw new Error('At least 1 of the 2 clientEmailToAdd and clientEmailToRemove have values');
            }
            return await clinicActionLogic.updateClinicClientAttendee(clinicName, clientEmailToAdd, clientEmailToRemove);
        }
    }
}