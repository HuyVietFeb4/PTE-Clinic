'use strict'
const { api, Action } = require('actionhero');

module.exports = class changePasswordAdminAction extends Action {
    constructor() {
        super();
        this.name = 'changePasswordAdmin';
        this.description = 'Change password admin action';
        // this.middleware = ['authorizationMiddleware'];
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
            oldPassword: {
                type: [String],
                default: [],
                validator: this.passwordValidator
            },
            newPassword: {
                type: [String],
                default: [],
                validator: this.passwordValidator
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.changePasswordAdmin(data.params.adminEmail, data.params.clinicName, data.params.oldPassword, data.params.newPassword);
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

    passwordValidator(Password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
        if (!passwordRegex.test(Password)) {
            throw new Error('Password must have minimum eight characters, maximum 100 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)');
        }
    }

    emailValidator(Email) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!emailRegex.test(Email)) {
            throw new Error('Invalid email format');
        }
    }

    stringValidator(string) {
        const stringRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;
        if(!stringRegex.test(string)) {
            throw new Error(`Invalid string: ${string}`)
        }
    }
}