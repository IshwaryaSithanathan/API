var Promise = require('promise')
var ActiveJob = require('../models/activeItem')
var ClientManager = require('communicator')

exports.fetchActiveJob = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      new ActiveJob(ClientManager.getActivePrint()).getJsonObject().then(function (data) {
        resolve(res.json(data))
      })
    } catch (ex) {
      reject(res.sendStatus(401))
    }
  })
}
