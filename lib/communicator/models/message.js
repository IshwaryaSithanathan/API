var os = require('os')
var Utils = require('../controllers/utils')

function Message (userID) {
  this.userID = userID
  this.hostname = os.hostname()
};

Message.prototype = {
  createSimpleMessage: function (type, status) {
    this.printerName = os.hostname()
    this.messageID = Utils.generateRandom()
    this.type = type
    this.status = status
  },
  parseMessage: function (msg) {
    this.type = msg.type
    this.status = msg.status
    this.message = msg
  },
  getStatus: function () {
    return this.status
  },
  getType: function () {
    return this.type
  },
  getData: function (key) {
    return this.message[key]
  },
  stringify: function () {
    return JSON.stringify(this)
  }
}

module.exports = Message
