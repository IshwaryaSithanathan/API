var server = require('nodebootstrap-server')
var express = require('express')
var appConfig = require('../../appConfig')

exports.beforeEach = function (app, callback) {
  server.setupTest(app, function (app) {
    appConfig.setup(app, callback)
  })
}

exports.express = function () {
  return express()
}
