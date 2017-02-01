var Promise = require('promise')
var User = require('passport/models/user')
var Token = require('passport/models/token')
var Apiutils = require('./apiutils')
var exports = module.exports

exports.generateToken = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      var userID = req.headers.userid
      if (!userID.trim()) {
        return reject(res.sendStatus(400))
      }
      User.findOne({ _id: userID }).populate('token').exec(function (err, user) {
        if (err) {
          reject(res.sendStatus(401))
        } else {
          if (user == null) {
            return reject(res.sendStatus(401))
          }
          if (user.token == null) {
            var tokenObj = null
            if (req.headers.forever) {
              tokenObj = user.generateToken(Apiutils.expiryEnum.NeverExpire)
            } else {
              tokenObj = user.generateToken(Apiutils.expiryEnum.DefaultExpiry)
            }
            resolve(res.json({ 'user': user, 'key': tokenObj.value, 'keyExpiry': tokenObj.expires }))
          } else {
            resolve(res.json({ 'message': 'Token exists', 'token': user }))
          }
        }
      })
    } catch (ex) {
      reject(res.sendStatus(401))
    }
  })
}

exports.findToken = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      Token.findOne({ value: req.headers.apikey }).populate('user').exec(function (err, token) {
        if (err || !token) {
          resolve(res.send({ 'message': 'Token expired' }))
        } else {
          resolve(res.send({ 'expiry': token.getExpiringDate(), 'message': 'Token valid' }))
        }
      })
    } catch (ex) {
      reject(res.sendStatus(401))
    }
  })
}
