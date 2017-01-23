var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserDetail = new Schema({
  username: String,
  password: String
})
var UserDetails = module.exports = mongoose.model('login', UserDetail)
module.exports.getUserById = function (id, callback) {
  UserDetails.findById(id, callback)
}
module.exports.getUserByUsername = function (username, callback) {
  var query = {username: username}
  UserDetails.findOne(query, callback)
}

