var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema  = new mongoose.Schema({ 
    UserID: { type: Schema.Types.ObjectId, ref: 'User' },
    ClinicAdministered: [{ type: Schema.Types.ObjectId, ref: 'Clinic' }],
}, { collection : 'Admin' });

var AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = {
    Model : AdminModel,
    Schema : AdminSchema
}
