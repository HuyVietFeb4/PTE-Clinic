'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getClientsAction extends Action {
    constructor() {
        super();
        this.name = 'getClients';
        this.description = 'Get clients with filter and sort option action';
        this.middleware = ['authorizationMiddleware'];
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
                type: [String], 
                default: [],
                validator: this.sortDirectionValidator
            },
            getLocation: {
                type: Boolean,
                default: true
            },
            getClinicAttend: {
                type: Boolean,
                default: true
            },
            limit: {
                type: String,
                default: '-1',
                validator: this.numberValidator,
            },
            skip: {
                type: String,
                default: '0',
                validator: this.numberValidator,
            }
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.getClients(data.params.pathToFind, data.params.valuesToFind, data.params.pathToSort, data.params.sortDirection
            , data.params.getLocation, data.params.getClinicAttend, parseInt(data.params.limit), parseInt(data.params.skip));
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
            data.response.clients = dataRes.data.data;
            data.response.totalCount = dataRes.data.totalCount;
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
            if (value !== '-1' && value !== '1') {
                throw new Error('Sort value must be -1 or 1');
            }
        }
    }

    numberValidator(numberStr) {
        const numberRegex = /^[0-9]+/;
        if(!numberRegex.test(numberStr)) {
            throw new Error('Invalid number format');
        }
        const number = parseInt(numberStr);
        if(number > 10000000 || number < -1) {
            throw new Error('Number out of range');
        }
    }
}