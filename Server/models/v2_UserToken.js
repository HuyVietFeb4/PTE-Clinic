var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userTokenSchema  = new mongoose.Schema({
        TokenValue: String,
        CreatedTime: Date,
        LastActionTime: Date,
        UserID: {type: Schema.Types.ObjectId, ref: 'v2User'},
        UserRole: String,
        ExpiredTime: Date
    }, { collection : 'UserToken' });

var userTokenModel = mongoose.model('v2UserToken', userTokenSchema);

module.exports = {
    Model : userTokenModel,
    Schema : userTokenSchema
}
