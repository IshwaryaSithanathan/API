var exports = module.exports
var Promise = require('promise')
var ClientManager = require('communicator')

exports.fetchVersion = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(res.json(ClientManager.getVersion()))
    } catch (ex) {
      reject(res.send(401))
    }
  })
}
