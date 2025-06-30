var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema  = new mongoose.Schema({ 
    ClinicAttended: [{ type: Schema.Types.ObjectId, ref: 'Clinic' }],
    UserID: { type: Schema.Types.ObjectId, ref: 'User' },
    Location: { type: Schema.Types.ObjectId, ref: 'Location' }
}, { collection : 'Client' });

var ClientModel = mongoose.model('Client', ClientSchema);

module.exports = {
    Model : ClientModel,
    Schema : ClientSchema
}
