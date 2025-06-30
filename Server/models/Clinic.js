var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClinicSchema  = new mongoose.Schema({ 
    ClinicName: String,
    Location: { type: Schema.Types.ObjectId, ref: 'Location' }
}, { collection : 'Clinic' });

var ClinicModel = mongoose.model('Clinic', ClinicSchema);

module.exports = {
    Model : ClinicModel,
    Schema : ClinicSchema
}
