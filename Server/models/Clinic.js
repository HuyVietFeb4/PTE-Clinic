var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clinicSchema  = new mongoose.Schema({ 
    clinicName: String,
    clinicLocationID: { type: Schema.Types.ObjectId, ref: 'location' },
    clientAttendedIDs: [{ type: Schema.Types.ObjectId, ref: 'client' }],
}, { collection : 'clinic' });

var clinicModel = mongoose.model('clinic', clinicSchema);

module.exports = {
    Model: clinicModel,
    Schema: clinicSchema
}
