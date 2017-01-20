var net = require('net')
var Promise = require('promise')
var Message = require('../models/message')
var Utils = require('./utils')
var clientSocket = null
var clientID = null
var HOST = '127.0.0.1'
var PORT = 8889

function sendMessage (message) {
  if (!clientSocket == null) {
    console.log('error no client available.')
    setTimeout(function () {
    }, 0)
    return
  }
  return new Promise(function (resolve, reject) {
    try {
      resolve(clientSocket.write(message))
    } catch (ex) {
      reject(ex)
    }
  })
}

function retryConnection () {
  return new Promise(function (resolve, reject) {
    try {
      resolve(startConnection())
    } catch (ex) {
      reject(ex)
    }
  })
}

function sendTempKeepAlivePackets () {
  setTimeout(function () {
    return new Promise(function (resolve, reject) {
      var message = new Message(clientID)
      message.createSimpleMessage(Utils.messageTypeEnum.KeepAlive.key, Utils.statusTypeEnum.NotStarted.value)
      resolve(sendMessage(message.stringify() + '\n'))
    })
  }, 2000)
}

function processMessage (data) {
  try {
    return new Promise(function (resolve, reject) {
      if (data === null || data.length < 1) {
        return
      }

      setTimeout(function () {
        var message = new Message(clientID)
        message.parseMessage(JSON.parse(data))
        if (message.getType() === Utils.messageTypeEnum.Register.key && message.getStatus() === Utils.statusTypeEnum.Started.value) {
          resolve(sendTempKeepAlivePackets())
        } else if (message.getType() === Utils.messageTypeEnum.KeepAlive.key && message.getStatus() === Utils.statusTypeEnum.Started.value) {
          resolve(sendTempKeepAlivePackets())
        } else {
          resolve(require('communicator').recieveData(message))
        }
      }, 2000)
    })
  } catch (ex) {
    console.log(ex)
  }
}

function startConnection () {
  clientSocket = new net.Socket()
  clientSocket.setEncoding('utf8')
  // On connecting to the server
  clientSocket.connect(PORT, HOST, function () {
    clientID = 'Client-' + Utils.generateRandom()
    var message = new Message(clientID)
    message.createSimpleMessage(Utils.messageTypeEnum.Register.key, Utils.statusTypeEnum.NotStarted.value)
    sendMessage(message.stringify() + '\n')
  })

  // On recieving data
  var sockBuf = ''
  clientSocket.on('data', function (data) {
    sockBuf += data
    var i
    var l = 0
    while ((i = sockBuf.indexOf('\n', l)) !== -1) {
      processMessage(sockBuf.slice(l, i))
      l = i + 1
    }
    if (l) {
      sockBuf = sockBuf.slice(l)
    }
  })

  // If connection refused or closed - reconnect
  clientSocket.on('error', function (e) {
    if (e.code === ('ECONNREFUSED' || 'EPIPE')) {
      setTimeout(function () {
        if (clientSocket != null) {
          clientSocket.destroy()
        }
        retryConnection()
      }, 2000)
    }

    // If server not reachable - reconnect
    if (e.code === 'EPIPE') {
      console.log('Server not reachable..')
      setTimeout(function () {
        if (clientSocket != null) {
          clientSocket.destroy()
          clientSocket = null
        }
        retryConnection()
      }, 2000)
    }

    // If address in use - do not attempt reconnect
    if (e.code === 'EADDRINUSE') {
      console.log('[x] Disconnected , address in use' + e)
      setTimeout(function () {
        clientSocket.destroy()
        return
      }, 0)
    }

    clientID = null
    clientSocket = null
  })
}

module.exports = function Handlers () {
  Handlers.prototype.sendMessage = function (message) {
    sendMessage(message)
  }
  Handlers.prototype.startConnection = function () {
    startConnection()
  }
}