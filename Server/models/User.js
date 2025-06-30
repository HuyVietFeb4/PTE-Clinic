var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema  = new mongoose.Schema({ 
    Email : String,
    Password: String,
    FirstName: String, 
    LastName: String, 
    UserName: String,
    AccountStatus: String, // deactivated/lock/activated/approved/registered
    Role: String,
}, { collection : 'User' });

var UserModel = mongoose.model('User', clientSchema);

module.exports = {
    Model : UserModel,
    Schema : UserSchema
}
