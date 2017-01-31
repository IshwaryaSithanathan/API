require('app-module-path').addPath(require('path').join(__dirname, '/lib'))

var server = require('nodebootstrap-server')
var appConfig = require('./appConfig')
var app = require('express')()
var bodyParser = require('body-parser')

app = require('nodebootstrap-htmlapp').setup(app)
app.use(bodyParser.urlencoded({extended: false}))
server.setup(app, appConfig.setup)

