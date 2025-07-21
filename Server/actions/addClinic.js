'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class addClinicAction extends Action {
    constructor() {
        super();
        this.name = 'addClinic';
        this.description = 'Add clinic action';
        this.middleware = ['authorizationMiddleware'];
        this.inputs = {
            clinicName: {
                type: String,
                required: true,
                validator: this.clinicNameValidator
            },
            locationName: {
                type: String,
                required: true,
                validator: this.clinicNameValidator
            },
            number: {
                type: String, 
            },
            street: {
                type: String, 
            },
            ward: {
                type: String, 
            },
            district: {
                type: String, 
            },
            city: {
                type: String, 
            },
            country: {
                type: String, 
            }
        }
    }

    async executeFunction(data) {
        try {
            const addLocationRes = await api.location.addLocation(data.params.locationName, data.params.number, data.params.street, data.params.ward, data.params.district, data.params.city, data.params.country);
            if(addLocationRes.success) {
                const result = await api.clinic.addClinic(data.params.clinicName, data.params.locationName);
                return { data: result };
            }
            else {
                return { err: addLocationRes.message };
            }
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

    clinicNameValidator(clinicName) {
        const clinicNameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
        if (clinicName.length < 3 || clinicName.length > 100) {
            throw new Error('Invalid location name length');
        }

        if (!clinicNameRegex.test(clinicNameRegex)) {
            throw new Error('Invalid character(s) detected');
        }
    }
}