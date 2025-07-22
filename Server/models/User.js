var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema  = new mongoose.Schema({ 
    email : String,
    password: String,
    userName: String,
    firstName: String, 
    lastName: String, 
    accountStatus: {type: String, default: 'registered'}, // deactivated/locked/activated/registered
    role: {type: String, default: 'client'}, // clinicAdmin, client, systemAdmin
    lastFailedLogin: {type: Date, default: new Date()},
    failedLoginAttemps: { type: Number, default: 0 },
}, { collection : 'user' });

var UserModel = mongoose.model('user', userSchema);

module.exports = {
    Model: UserModel,
    Schema: userSchema
}
