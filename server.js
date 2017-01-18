require('app-module-path').addPath(__dirname + '/lib');

var server = require('nodebootstrap-server')
    , appConfig = require('./appConfig')
    , app    = require('express')()
    , bodyParser = require('body-parser')
    
app = require('nodebootstrap-htmlapp').setup(app);
app.use(bodyParser.urlencoded({extended: false}));

server.setup(app, appConfig.setup);