var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userModel = require('./user').Model;

var adminSchema  = new mongoose.Schema({ 
    clinicAdministeredID: { type: Schema.Types.ObjectId, ref: 'clinic' },
}, { collection : 'admin' });

var adminModel = userModel.discriminator('admin', adminSchema);

module.exports = {
    Model: adminModel,
    Schema: adminSchema
}
