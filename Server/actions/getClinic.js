'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getClinicAction extends Action {
    constructor() {
        super();
        this.name = 'getClinic';
        this.description = 'Get clinic with filter option action';
        this.middleware = ['authorizationMiddleware'];
        this.inputs = {
            pathToFind: {
                type: String,
                validator: this.pathListValidator
            },
            valuesToFind: {
                type: String, 
                validator: this.stringListValidator
            },
            getLocation: {
                type: Boolean,
                default: true
            },
            getClientAttendees: {
                type: Boolean,
                default: true
            }
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.clinic.getClinic(data.params.pathToFind, data.params.valuesToFind, data.params.getLocation, data.params.getClientAttendees)
            return { data: result };
        } catch (error) {
            return { err: error };
        }
    }
    
    async run(data) {
        let dataRes = await this.executeFunction(data);
        if ('err' in dataRes) {
            data.response.errorCode = dataRes.err.message;
        }
        else {
            data.response.success = dataRes.data.success;
            data.response.message = dataRes.data.message;
            data.response.clinic = dataRes.data.data;
        }
    }

    strinValidator(string) {
        const stringRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;
        if(!stringRegex.test(string)) {
            throw new Error(`Invalid string: ${string}`)
        }
    }
}