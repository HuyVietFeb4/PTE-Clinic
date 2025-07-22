'use strict'
const { api, Action } = require('actionhero');

module.exports = class adminLoginAction extends Action {
    constructor() {
        super();
        this.name = 'adminLogin';
        this.description = 'Admin login action';
        this.middleware = ['authenticationMiddleware'];
        this.inputs = {
            email: {
                type: String,
                required: true,
                validator: this.emailValidator
            },
            password: {
                type: String, 
                required: true,
                validator: this.passwordValidator
            },
            clinicName: {
                type: String,
                required: true,
                validator: this.clinicNameValidator
            }
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.adminLogin(data.params.email, data.params.password);
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
            data.response.token = dataRes.data.token;
        }
    }

    emailValidator(Email) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!emailRegex.test(Email)) {
            throw new Error('Invalid email format');
        }
    }
    
    passwordValidator(Password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
        if (!passwordRegex.test(Password)) {
            throw new Error('Password must have minimum eight characters, maximum 100 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)');
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