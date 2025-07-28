'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getUserAction extends Action {
    constructor() {
        super();
        this.name = 'getUser';
        this.description = 'Get user action';
    }

    async executeFunction(data) {
        try {
            const token = data.connection.rawConnection?.cookies?.api_auth_token || data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1] ;
            const result = await api.user.getUser(token);
            return { data: result }; 
        } catch (error) {
            return { err: error };
        }
    }
    
    async run(data) {
        let dataRes = await this.executeFunction(data);
        if ('err' in dataRes) {
            throw new Error(dataRes.err);
        }
        else {
            data.response.success = dataRes.data.success;
            data.response.message = dataRes.data.message;
            data.response.user = dataRes.data.data;
        }
    }

    emailValidator(Email) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!emailRegex.test(Email)) {
            throw new Error('Invalid email format');
        }
    }
    
    stringValidator(string) {
        const stringRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;
        if(!stringRegex.test(string)) {
            throw new Error(`Invalid string: ${string}`)
        }
    }
}