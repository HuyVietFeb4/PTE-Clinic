'use strict'
const { api, Action } = require('actionhero');

module.exports = class signupAction extends Action {
    constructor() {
        super();
        this.name = 'createSystemAdmin';
        this.description = 'create system admin action';
        this.middleware = ['systemAdminMiddleware'];
        this.inputs = {
            username: {
                type: String, 
                required: true,
                validator: this.usernameValidator
            },
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
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.user.createSystemAdmin(data.params.email, data.params.username, data.params.password);
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

    roleValidator(Role) {
        let allowedRole = ['client', 'clinicAdmin', 'systemAdmin']
        if (!allowedRole.includes(Role)) {
            throw new Error('Invalid role');
        }
    }
    usernameValidator(Username) {
        const usernameRegex = /^[_a-zA-Z0-9]+$/;
        if(Username.length > 20 || Username.length < 3) {
            throw new Error('Invalid username length (Minimum: 3 Maximum: 20)');
        } 
        if (!usernameRegex.test(Username)) {
            throw new Error('Invalid character(s) detected');
        }
    }
}