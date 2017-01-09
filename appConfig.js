require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function(runningApp, callback) {
    
  var mongoose = require('mongoose');
  var passport = require('passport');
  var configDB = require('database');
  
  runningApp.disable("x-powered-by");
  runningApp.set('view engine', 'handlebars');
  runningApp.engine('handlebars', require('hbs').__express);
  
  // Initialize Passport
  require('passport/authenticate')(passport);
  runningApp.use(passport.initialize());
  
  // Setup Mongoose
  mongoose.connect(configDB.url); 

  var api = require('express').Router();
  
  // Load routes
  require('version')(api, passport);
  
  // Assign routes
  runningApp.use('/version', api);
  
  //Define tcp comms
  var client = require('communicator/client');
  client.openConnection();
  
  if(typeof callback === 'function') {
    callback(runningApp);
  }
};
