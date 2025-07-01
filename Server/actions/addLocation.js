'use strict'
const { api, Action } = require('actionhero');

module.exports = class addLocationAction extends Action {
    constructor() {
        super();
        this.name = 'addLocation';
        this.description = 'Add location action';
        this.inputs = {
            locationName: {
                type: String,
                required: true,
                validator: this.locationNameValidator
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
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.location.addLocation(data.params.locationName, data.params.number, data.params.street, data.params.ward, data.params.district, data.params.city, data.params.country);
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

    locationNameValidator(locationName) {
        const locationNameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
        if (locationName.length < 3 || locationName.length > 100) {
            throw new Error('Invalid location name length');
        }

        if (!locationNameRegex.test(locationName)) {
            throw new Error('Invalid character(s) detected');
        }
    }
}