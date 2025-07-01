'use strict'
const { api, Action, action } = require('actionhero');

module.exports = class getAdminAction extends Action {
    constructor() {
        super();
        this.name = 'getAdmin';
        this.description = 'Add admin action';
        this.inputs = {
            email: {
                type: String,
                default: () => { return ''; },
                validator: this.emailValidator,
            }
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.getAdmin(data.params.email);
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

    emailValidator(Email) {
        if (Email !== '') {
            const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
            if (!emailRegex.test(Email)) {
                throw new Error('Invalid email format');
            }
        }
    }
}