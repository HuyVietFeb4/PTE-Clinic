'use strict'
const { api, Action } = require('actionhero');

module.exports = class updateClinicClientAttendee extends Action {
    constructor() {
        super();
        this.name = 'updateClinicClientAttendee';
        this.description = 'Update clinic\'s client attendees list action';
        this.inputs = {
            clinicName: {
                type: String,
                require: true,
                validator: this.nameValidator
            },
            clientEmailToAdd: {
                type: [String],
                default: [],
                validator: this.emailListValidator
            },
            clientEmailToRemove: {
                type: [String],
                default: [],
                validator: this.emailListValidator
            },
        }
    }

    async executeFunction(data) {
        try {
            const result = await api.clinic.updateClinicClientAttendee(data.params.clinicName, data.params.clientEmailToAdd, data.params.clientEmailToRemove);
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

    emailListValidator(emailList) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        for (let email of emailList) {
            if(!emailRegex.test(email)) {
                throw new Error(`Invalid email format: ${email}`)
            }
        }
    }

    nameValidator(name) {
        const nameRegex = /^[_a-zA-Z0-9]+( [_a-zA-Z0-9]+)*$/;        
        if (!nameRegex.test(name)) {
            throw new Error(`Invalid name format: ${name}`);
        }
    }
}