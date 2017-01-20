var Handler = require('./controllers/handlers')
var Utils = require('./controllers/utils')
var handler = null

var firmwareVersion = 'YYY'
var printQueueVersion = 'vX.X.X'
var apiVersion = 'v1'

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

  this.recieveData = function (message) {
    if (message.getType() === Utils.messageTypeEnum.Version.key) {
      firmwareVersion = message.getData(Utils.keyEnum.firmwareVersion.key)
      printQueueVersion = message.getData(Utils.keyEnum.printQueueVersion.key)
    }
  }

  this.sendMessage = function (message) {
    handler.sendMessage(message)
  }

  this.getClientId = function (message) {
    return handler.getClientId()
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
