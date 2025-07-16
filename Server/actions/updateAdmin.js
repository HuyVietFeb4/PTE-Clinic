'use strict'
const { api, Action } = require('actionhero');

module.exports = class updateAdminAction extends Action {
    constructor() {
        super();
        this.name = 'updateAdmin';
        this.description = 'Update admin info action';
        this.inputs = {
            adminEmail: {
                type: String,
                require: true,
                validator: this.emailValidator
            },
            clinicName: {
                type: String,
                require: true,
                validator: this.stringValidator
            },
            pathToUpdate: {
                type: [String],
                default: [],
                validator: this.pathListValidator
            },
            valueToUpdate: {
                type: [String],
                default: [],
                validator: this.stringListValidator
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.updateAdmin(data.params.adminEmail, data.params.clinicName, data.params.pathToUpdate, data.params.valueToUpdate);
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
        }
    }

    stringListValidator(stringList) {
        const stringRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;
        for (let string of stringList) {
            if(!stringRegex.test(string)) {
                throw new Error(`Invalid path: ${string}`)
            }
        }
    }
    pathListValidator(pathList) {
        const pathRegex = /^[_a-zA-Z0-9]+$/;
        for (let path of pathList) {
            if(!pathRegex.test(path)) {
                throw new Error(`Invalid path: ${path}`)
            }
        }
    }

    stringValidator(string) {
        const stringRegex = /^[_a-zA-Z0-9]+$/;
        if(!stringRegex.test(string)) {
            throw new Error(`Invalid string: ${string}`)
        }
    }

    emailValidator(Email) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!emailRegex.test(Email)) {
            throw new Error('Invalid email format');
        }
    }
}