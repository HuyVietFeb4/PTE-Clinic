var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema  = new mongoose.Schema({ 
    ClientName : String,
    Admin: { type: Schema.Types.ObjectId, ref: 'v2User' },
    Phone : String,
    Email : String,
    LogoUrl: String,
    TimeZoneValue: String,
    Activated: String,
    DateSetting: String,
    TimeSetting: { type: String, default: "time12" },
    EIN : { type: String, default: '' },
}, { collection : 'Client' });

var clientModel = mongoose.model('v2Client', clientSchema);

module.exports = {
    Model : clientModel,
    Schema : clientSchema
}
