const { Initializer, api } = require('actionhero');
const clinicActionLogic = require('../logicMongo/clinicActionLogic');
module.exports = class clinicInitializer extends Initializer {
    constructor() {
        super();
        this.name = 'clinic';
    }

    async initialize() {
        api.clinic = {};

        api.clinic.addClinic = async function (clinicName, locationName) { 
            return await clinicActionLogic.addClinic(clinicName, locationName);
        };

    }
}