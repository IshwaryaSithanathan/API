var exports = module.exports
var Promise = require('promise')
var ClientManager = require('communicator')
var fs = require('fs')
var Utils = require('communicator/controllers/utils')
var Message = require('communicator/models/message')
var JobItem = require('communicator/models/jobitem')

exports.fetchJobs = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(res.json(ClientManager.getJobs()))
    } catch (ex) {
      reject(res.send(404))
    }
  })
}

exports.fetchJob = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(res.json(ClientManager.getJob(req.params.id)))
    } catch (ex) {
      reject(res.send(404))
    }
  })
}

exports.uploadJob = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      if (!req.files.file) {
        reject(res.sendStatus(400))
      }
      var file = req.files.file
      var tmpPath = file.path
      var jobitem = new JobItem(file)

      if (jobitem.validate()) {
        reject(res.sendStatus(415))
      }

      var src = fs.createReadStream(tmpPath)
      var dest = fs.createWriteStream(jobitem.getTargetPath())

      src.pipe(dest)
      src.on('end', function () {
        var message = new Message()
        message.createSimpleMessage(Utils.messageTypeEnum.NewPrint.key, Utils.statusTypeEnum.NotStarted.value)
        message.setMessage(jobitem.stringify())
        ClientManager.sendMessage(message)
        resolve(res.send(jobitem.stringify()))
      })

      src.on('error', function (err) { if (err) res.sendStatus(500) })
    } catch (ex) {
      reject(res.sendStatus(500))
    }
  })
}
