const { Initializer, api } = require('actionhero');
const locationActionLogic = require('../logicMongo/locationActionLogic');
module.exports = class locationInitializer extends Initializer {
    constructor() {
        super();
        this.name = 'location';
    }

    async initialize() {
        api.location = {};

        api.location.addLocation = async function (locationName, number, street, ward, district, city, country) { 
            return await locationActionLogic.addLocation(locationName, number, street, ward, district, city, country);
        };

    }
}