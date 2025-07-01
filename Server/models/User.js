var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema  = new mongoose.Schema({ 
    email : String,
    password: String,
    userName: String,
    firstName: String, 
    lastName: String, 
    accountStatus: String, // deactivated/lock/activated/approved/registered
    role: {type: String, default: 'client'}, // Admin, Client
    lastFailedLogin: {type: Date, default: new Date()},
    failedLoginAttemps: { type: Number, default: 0 },
}, { collection : 'user' });

var UserModel = mongoose.model('user', clientSchema);

module.exports = {
    Model: UserModel,
    Schema: UserSchema
}
