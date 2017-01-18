require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function (runningApp, callback) {
  var express = require('express');
  var mongoose = require('mongoose');
  var passport = require('passport');
  var configDB = require('database');
  var path = require('path');
  var exphbs = require('express-handlebars');
  var flash = require('connect-flash');
  var session = require('express-session');
  var passport = require('passport');
// var login = require('./lib/login/index.js');


  // View Engine
  runningApp.disable("x-powered-by");
  runningApp.set('view engine', 'handlebars');
  runningApp.engine('handlebars', exphbs({defaultLayout:'layout'}));

  // Set Static Folder
  runningApp.use(express.static(path.join(__dirname, 'public')));

  // Express Session
  runningApp.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }));


  // Initialize Passport
  require('passport/authenticate')(passport);
  require('passport/login')(passport);
  runningApp.use(passport.initialize());
  runningApp.use(passport.session()); 

  // Setup Mongoose
  mongoose.Promise = global.Promise;
  mongoose.createConnection(configDB.url);

  // Connect Flash
  runningApp.use(flash());

  // Global Vars
    runningApp.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });


  // Load routes
  var versionRoute = require('version')(passport);
  var apiRoute = require('api')(passport);

  // Assign routes
  runningApp.use('/version', versionRoute);
  runningApp.use('/api', apiRoute);
 runningApp.use('/', require('login'));



  //Define tcp comms
  var client = require('communicator/client');
  client.openConnection();

  if (typeof callback === 'function') {
    callback(runningApp);
  }
};
