var mongoose = require('mongoose')
var moment = require('moment')
var Schema = mongoose.Schema
var ApiUtils = require('api/controllers/apiutils')

var defaultTokenExpiry = 60 * 60 * 24 * 30 // Expire in 30 days

var tokenSchema = mongoose.Schema({
  value: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  created: {
    type: Date,
    expires: defaultTokenExpiry,
    required: false
  },
  expires: { type: Number }
})

tokenSchema.methods.setTokenExpiry = function (expiryEnum) {
  if (expiryEnum === ApiUtils.expiryEnum.DefaultExpiry) {
    this.created = new Date()
    this.expires = defaultTokenExpiry
  } else {
    this.expires = -1
  }
}

tokenSchema.methods.getExpiringDate = function () {
  if (this.expires === -1) {
    return -1
  } else {
    return moment(this.created).add(this.expires, 'seconds').toISOString()
  }
}
tokenSchema.index({ created: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Token', tokenSchema)
