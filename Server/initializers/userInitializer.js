const { Initializer, api } = require('actionhero');
const userActionLogic = require('../logicMongo/userActionLogic');

module.exports = class userInitializer extends Initializer {
    constructor() {
        super();
        this.name = 'user';
        this.saltRounds = 10;
        this.usersHash = 'user';
    }

    async initialize() {
        api.user = {};

        api.user.signup = async function (email, username, password, role) { 
            return await userActionLogic.signup(email, username, password, role);
        };
        
        api.user.clientLogin = async function (email, username) { 
            return await userActionLogic.clientLogin(email, username);
        };

        api.user.adminLogin = async function (email, username) { 
            return await userActionLogic.adminLogin(email, username);
        };

        api.user.getClient = async function (clientEmail) {
            return await userActionLogic.getClient(clientEmail);
        }

        api.user.getAdmin = async function (adminEmail) {
            return await userActionLogic.getAdmin(adminEmail);
        }

        api.user.getClients = async function(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
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
            if (!getLocation && !getClinicAttend) {
                throw new Error('at least one of getLocation and getClinicAttend must be true');
            }
            // Return: a list of clients with relevent clinics attended and location documents
            return await userActionLogic.getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend);
        }

        api.user.updateClient = async function (clientEmail, pathToUpdate, valueToUpdate) {
            if (pathToUpdate.length !== valueToUpdate.length) {
                throw new Error('pathToUpdate and valueToUpdate must be the same length');
            }
            if (pathToUpdate.length === 0 || valueToUpdate.length === 0) {
                throw new Error('Must have at least 1 path and value to update');
            }
            return await userActionLogic.updateClient(clientEmail, pathToUpdate, valueToUpdate);
        }

        api.user.updateClientClinicAttended = async function (clientEmail, clinicNameToAdd, clinicNameToRemove) {
            if (clinicNameToAdd.length === 0 && clinicNameToRemove.length === 0) {
                throw new Error('At least 1 of the 2 clinicNameToAdd and clinicNameToRemove have values');
            }
            return await userActionLogic.updateClientClinicAttended(clientEmail, clinicNameToAdd, clinicNameToRemove);
        }
	}
}