'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class deleteAdminAction extends Action {
    constructor() {
        super();
        this.name = 'deleteAdmin';
        this.description = 'Delete admin action';
        this.middleware = ['authorizationMiddleware'];
        this.inputs = {
            adminEmail: {
                type: String,
                required: true,
                validator: this.emailValidator
            },
            clinicName: {
                type: String,
                require: true,
                validator: this.stringValidator
            }
        }
    }

    async executeFunction(data) {
        try {
            const deleteAdminRes = await api.user.deleteAdmin(data.params.adminEmail, data.params.clinicName);
            return { data: deleteAdminRes };
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