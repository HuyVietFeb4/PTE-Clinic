'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getLocationssAction extends Action {
    constructor() {
        super();
        this.name = 'getLocations';
        this.description = 'Get locations with filter and sort option action';
        this.inputs = {
            pathToFind: {
                type: [String],
                default: [],
                validator: this.pathListValidator
            },
            valuesToFind: {
                type: [String], 
                default: [],
                validator: this.stringListValidator
            },
            pathToSort: {
                type: [String], 
                default: [],
                validator: this.pathListValidator
            },
            sortDirection: {
                type: [Number], 
                default: [],
                validator: this.sortDirectionValidator
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.location.getLocations(data.params.pathToFind, data.params.valuesToFind, data.params.pathToSort, data.params.sortDirection);
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
            data.response.clinics = dataRes.data.data;
        }
    }

    stringListValidator(stringList) {
        const stringRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;
        for (let string of stringList) {
            if(!stringRegex.test(string)) {
                throw new Error(`Invalid string: ${string}`)
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
    sortDirectionValidator(sortDirection) {
        for (let value of sortDirection) {
            if (value !== -1 && value !== 1) {
                throw new Error('sort value must be -1 or 1');
            }
        }
    }
}