var Handler = require('./controllers/handlers')
var Utils = require('./controllers/utils')
var handler = null

var firmwareVersion = 'YYY'
var printQueueVersion = 'vX.X.X'
var apiVersion = 'v1'

var jobs = {}

var ClientManager = function ClientManager () {
  this.openConnection = function () {
    handler = new Handler()
    handler.startConnection()
  }

  this.getVersion = function () {
    var version = {}
    version['api_version'] = apiVersion
    version['printqueue_version'] = printQueueVersion
    version['firmware_version'] = firmwareVersion
    return version
  }

  this.getJobs = function () {
    return jobs
  }

  this.getJob = function (id) {
    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i]
      var jobid = job['jobid']
      if (jobid.localeCompare(id) === 0) {
        return job
      }
    }
    return null
  }

  this.recieveData = function (message) {
    if (message.getType() === Utils.messageTypeEnum.Version.key) {
      firmwareVersion = message.getData(Utils.keyEnum.firmwareVersion.key)
      printQueueVersion = message.getData(Utils.keyEnum.printQueueVersion.key)
    } else if (message.getType() === Utils.messageTypeEnum.UpdateAll.key) {
      jobs = message.getData(Utils.keyEnum.jobs.key)
    }
  }

  this.sendMessage = function (message) {
    handler.sendMessage(message)
  }

  this.send = function (message) {
    return handler.send(message)
  }
}

ClientManager.instance = null

ClientManager.getInstance = function () {
  if (this.instance === null) {
    this.instance = new ClientManager()
  }
  return this.instance
}

module.exports = ClientManager.getInstance()
