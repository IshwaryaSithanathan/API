var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var User = require('./user');

var defaultTokenExpiry = 60 * 60 * 24 * 30; // Expire in 30 days
var tokenSchema = mongoose.Schema({
    value: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, expires: defaultTokenExpiry, default: Date.now },
    expires: { type: Number, default: defaultTokenExpiry }
});

tokenSchema.methods.getExpiringDate = function() {
    return moment(this.created).add(this.expires, 'seconds').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = mongoose.model('Token', tokenSchema);
