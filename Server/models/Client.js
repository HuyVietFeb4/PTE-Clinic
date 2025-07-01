var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userModel = require('./user').Model


var clientSchema  = new mongoose.Schema({ 
    clinicAttended: [{ type: Schema.Types.ObjectId, ref: 'clinic' }],
    location: { type: Schema.Types.ObjectId, ref: 'location' }
}, { collection : 'client' });

var clientModel = userModel.discriminator('client', clientSchema);

module.exports = {
    Model: clientModel,
    Schema: clientSchema
}
