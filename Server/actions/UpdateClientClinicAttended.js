'use strict'
const { api, Action } = require('actionhero');

module.exports = class updateClientClinicAttended extends Action {
    constructor() {
        super();
        this.name = 'signup';
        this.description = 'User signup action';
        this.inputs = {
            clientEmail: {
                type: String,
                require: true,
                validator: this.emailValidator
            },
            clinicNameToAdd: {
                type: [String],
                default: [],
                validator: this.stringListValidator
            },
            clinicNameToRemove: {
                type: [String],
                default: [],
                validator: this.stringListValidator
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.updateClientClinicAttended(data.params.clientEmail, data.params.clinicNameToAdd, data.params.clinicNameToRemove);
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

    emailValidator(Email) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!emailRegex.test(Email)) {
            throw new Error('Invalid email format');
        }
    }
}