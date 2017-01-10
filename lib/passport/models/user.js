var mongoose = require('mongoose');
var randtoken = require('rand-token');
var Schema = mongoose.Schema;
var Token = require('./token');

var userSchema = mongoose.Schema({
    token: { type: Schema.Types.ObjectId, ref: 'Token', default: null },
    email: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: false }
});

userSchema.methods.generateToken = function() {
    var token = new Token();
    token.value = randtoken.generate(32);
    token.user = this._id;
    this.token = token._id;
    this.save(function(err) {
        if (err)
            throw err;
        token.save(function(err) {
            if (err)
                throw err;
        });
    });
}

module.exports = mongoose.model('User', userSchema);