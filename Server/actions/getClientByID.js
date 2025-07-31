'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getClientByIDAction extends Action {
    constructor() {
        super();
        this.name = 'getClientByID';
        this.description = 'Get client by ID action';
        this.middleware = ['authorizationMiddleware'];
        this.inputs = {
            clientID: {
                type: String,
                required: true,
                validator: this.idValidator
            }
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.getClientByID(data.params.clientID);
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
            data.response.client = dataRes.data.data;
        }
    }

    idValidator(clientID) {
        const IDRegex = /^[a-f\d]{24}$/i;
        if (!IDRegex.test(clientID)) {
            throw new Error('Invalid clientID format');
        }
    }
}