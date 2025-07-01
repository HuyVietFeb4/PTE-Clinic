var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var locationSchema  = new mongoose.Schema({ 
    locationName: String,
    number: {type: String, default: ''},
    street: {type: String, default: ''},
    ward: {type: String, default: ''},
    district: {type: String, default: ''},
    city: {type: String, default: ''},
    country: {type: String, default: 'USA'}
}, { collection: 'location' });

var locationModel = mongoose.model('location', locationSchema);


module.exports = {
    Model: locationModel,
    Schema: locationSchema,
}