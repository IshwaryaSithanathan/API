var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserDetail = new Schema({
    username: String,
    password: String
}, {
    collection: 'userInfo'
});
var UserDetails = module.exports = mongoose.model('userInfo', UserDetail);


