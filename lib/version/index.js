var router = require('express').Router({ mergeParams: true })
var Promise = require('promise')
var ClientManager = require('../communicator')

module.exports = function (passport) {
  router.use(passport.authenticate('localapikey', { session: false }))

  router.get('/', function (req, res) {
    return new Promise(function (resolve, reject) {
      try {
        resolve(res.json(ClientManager.getVersion()))
      } catch (ex) {
        reject(ex)
      }
    })
  })
  return router
}
