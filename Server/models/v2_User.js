var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema  = new mongoose.Schema({ 
    Client: { type: Schema.Types.ObjectId, ref: 'v2Client' },
    Roles : [String] ,
    EnableAdminRights: {type: Boolean, default: false}, 
    FirstName : {type: String, default: ''}, 
    LastName : {type: String, default: ''},
    MiddleName: {type: String, default: ''},
    Username : String,
    Password : String,
    CreatedDate : Date,
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'v2User' },
    AvatarUrl : String,
    DOB : Date,
    Gender : String,
    Activated: { type: String, default: "N" },
    ActivatedDate : Date,
}, { collection: 'User' });

var userModel = mongoose.model('v2User', userSchema);

module.exports = {
    Model: userModel,
    Schema: userSchema,
}
