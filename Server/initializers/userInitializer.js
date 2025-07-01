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
        
        api.user.login = async function (email, username, role) { 
            return await userActionLogic.login(email, username, role);
        };
	}
}