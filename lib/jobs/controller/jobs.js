var exports = module.exports
var Promise = require('promise')
var ClientManager = require('communicator')

exports.fetchJobs = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(res.json(ClientManager.getJobs()))
    } catch (ex) {
      reject(res.send(401))
    }
  })
}
exports.fetchJob = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(res.json(ClientManager.getJob(req.params.id)))
    } catch (ex) {
      reject(res.send(401))
    }
  })
}
 

