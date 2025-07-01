var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userModel = require('./user').Model


var clientSchema  = new mongoose.Schema({ 
    clinicAttendedIDs: [{ type: Schema.Types.ObjectId, ref: 'clinic' }],
    clientLocationID: { type: Schema.Types.ObjectId, ref: 'location' }
}, { collection : 'client' });

var clientModel = userModel.discriminator('client', clientSchema);

module.exports = {
    Model: clientModel,
    Schema: clientSchema
}
