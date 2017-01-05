var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	id: { type: String, required: true },
    token: { type: Boolean, default: false, required: true },
    email: { type: Number, required: true },
    name: { type: Number, required: true },
    created_at: Date
});

module.exports = mongoose.model('User', userSchema);