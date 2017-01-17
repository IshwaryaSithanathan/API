var os = require('os')
var Utils = ('../controller/utils')

function Message (userID) {
  this.userID = userID
  this.hostname = os.hostname()
};

Message.prototype = {
  createSimpleMessage: function (type, status) {
    this.printerName = os.hostname()
    this.messageID = Utils.generateRandom
    this.type = type
    this.status = status
  },
  parseMessage: function (msg) {
    this.printerName = msg.printerName
    this.messageID = msg.messageID
    this.type = msg.type
    this.status = msg.status
  },
  getStatus: function () {
    return this.status
  },
  getType: function () {
    return this.type
  },
  stringify: function () {
    return JSON.stringify(this)
  }
}

module.exports = Message
