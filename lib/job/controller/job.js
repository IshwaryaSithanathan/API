var exports = module.exports
var Promise = require('promise')
var ClientManager = require('communicator')
var fs = require('fs')
var Utils = require('communicator/controllers/utils')
var Message = require('communicator/models/message')
var JobItem = require('../models/jobitem')

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
      var job = ClientManager.getJob(req.params.id)
      if (job === null) {
        reject(res.sendStatus(404))
      } else {
        resolve(res.json(ClientManager.getJob(req.params.id)))
      }
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
        return
      }
      var file = req.files.file
      var tmpPath = file.path
      var jobitem = new JobItem(file)

      if (jobitem.validate()) {
        reject(res.sendStatus(415))
        return
      }

      var src = fs.createReadStream(tmpPath)
      if (!fs.existsSync(jobitem.getTargetPath())) {
        fs.mkdirSync(jobitem.getTargetPath())
      }

      var dest = fs.createWriteStream(jobitem.getTargetPath() + jobitem.get('checksum'))

      src.pipe(dest)
      src.on('end', function () {
        var message = new Message()
        message.createSimpleMessage(Utils.messageTypeEnum.NewPrint.key, Utils.statusTypeEnum.NotStarted.value)
        message.setMessage(jobitem.stringify())
        ClientManager.sendMessage(message)
        resolve(res.send(jobitem.stringify()))
      })

      src.on('error', function (err) { if (err) reject(res.sendStatus(500)) })
    } catch (ex) {
      reject(res.sendStatus(500))
    }
  })
}

exports.deleteJob = function (req, res) {
  return new Promise(function (resolve, reject) {
    try {
      // has dependency on active print
      // send 409 if requested job is active
      var message = new Message()
      message.createSimpleMessage(Utils.messageTypeEnum.DeleteJob.key, Utils.statusTypeEnum.NotStarted.value)
      message.setMessage({'jobid': req.params.id})
      var timeout = setTimeout(function () {
        reject(res.sendStatus(500))
      }, 5000)

      ClientManager.query(message).then(replyMessage => {
        clearTimeout(timeout)
        if (replyMessage.getStatus() === false) {
          return resolve(res.sendStatus(404))
        } else {
          return resolve(res.sendStatus(204))
        }
      })
    } catch (ex) {
      return reject(res.send(404))
    }
  })
}
