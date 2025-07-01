var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clinicSchema  = new mongoose.Schema({ 
    clinicName: String,
    location: { type: Schema.Types.ObjectId, ref: 'location' }
}, { collection : 'clinic' });

var clinicModel = mongoose.model('clinic', clinicSchema);

module.exports = {
    Model: clinicModel,
    Schema: clinicSchema
}
