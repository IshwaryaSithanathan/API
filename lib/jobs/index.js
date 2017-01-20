
var multer = require('multer')
var upload = multer()
var fs = require('fs')
const md5File = require('md5-file')
var path = require('path')
var moment = require('moment')
var Utils = require('../communicator/controllers/utils')

var router = require('express').Router({ mergeParams: true })
var communicatorRoute = require('../communicator')
var Message = require('../communicator/models/message')
var os = require('os')

module.exports = function () {
  router.post('/upload', upload.single(), function (req, res, next) {
    if (!req.files) {
      res.sendStatus(400)
    }
    var file = req.files.file
    var tmpPath = file.path
    var hash = md5File.sync(tmpPath)
    var targetPath = os.homedir() + hash
    var ext = path.extname(file.path)

        /* localeCompare Expected Returns:
         0:  exact match
        -1:  string_a < string_b
         1:  string_a > string_b
         */
    if (ext.localeCompare('.zip') !== 0 || ext.localeCompare('.spj') !== 0) {
      res.sendStatus(415)
    }

    var src = fs.createReadStream(tmpPath)
    var dest = fs.createWriteStream(targetPath)

    var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    src.pipe(dest)
    src.on('end', function () {
      var url = 'http://' + os.hostname() + '.local:51749/'
      var jobID = 'Job-' + Utils.generateRandom()
      var clientID = communicatorRoute.getClientId()
      var message = new Message(clientID)
      message.createSimpleMessage(Utils.messageTypeEnum.NewPrint.key, Utils.statusTypeEnum.NotStarted.value)
      message.setMessage({ 'jobid': jobID, 'filename': file.originalFilename, 'checksum': hash, 'statusProperty': 'Uploaded', 'url': url })

      communicatorRoute.sendMessage(message)
      res.send({
        'name': file.originalFilename,
        'job_id': jobID,
        'checksum': hash,
        'size': file.size,
        'date': time,
        'download': url + hash
      })
    })

    src.on('error', function (err) { if (err) res.sendStatus(500) })
  })

  router.callbacks = require('./controller/jobs')
  router.get('/', router.callbacks.fetchJobs)
  router.get('/:id', router.callbacks.fetchJob)
  return router
}

