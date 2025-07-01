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

        api.user.getClient = async function getClient(clientEmail) {
            return await userActionLogic.getClient(clientEmail);
        }

        api.user.getAdmin = async function getAdmin(adminEmail) {
            return await userActionLogic.getAdmin(adminEmail);
        }

        api.user.getClients = async function(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend) {
            // pathsToFind: a list, what path to find for the user
            // valuesToFind: a list, values that system based on to find user
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
            // Return: a list of user with relevent product and location documents
            return await userActionLogic.getClients(pathsToFind, valuesToFind, pathToSort, sortDirection, getLocation, getClinicAttend);
        }
	}
}