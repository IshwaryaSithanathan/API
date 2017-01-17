var Handler = require('./controller/handlers')
var Utils = require('./controller/utils')
var handler = null

var firmwareVersion = null
var printQueueVersion = null
var apiVersion = null

var ClientManager = function ClientManager () {
  this.openConnection = function () {
    handler = new Handler()
    handler.startConnection()
  }

  this.getVersion = function () {
    var version = {}
    version['api_version'].push(apiVersion)
    version['printqueue_version'].push(printQueueVersion)
    version['firmware_version'].push(firmwareVersion)
    return JSON.stringify(version)
  }

  this.recieveData = function (message) {
    if (message.getType === Utils.messageTypeEnum.Version.key) {
      firmwareVersion = message.firmwareVersion
      printQueueVersion = message.printQueueVersion
    }
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
