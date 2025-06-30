var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationSchema  = new mongoose.Schema({ 
    // userPlaces: { type: Schema.Types.ObjectId, ref: 'user' },
    LocationName: String,
    Number: {type: String, default: ''},
    Street: {type: String, default: ''},
    Ward: {type: String, default: ''},
    District: {type: String, default: ''},
    City: {type: String, default: ''},
    Country: {type: String, default: 'USA'}
}, { collection: 'Location' });

var LocationModel = mongoose.model('Location', LocationSchema);


module.exports = {
    Model: LocationModel,
    Schema: LocationSchema,
}