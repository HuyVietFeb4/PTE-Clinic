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
	}
}