require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function(runningApp, callback) {
var express = require('express');
    var mongoose = require('mongoose');
    var passport = require('passport');
    var configDB = require('database');
    var path = require('path');
    var exphbs = require('express-handlebars');
    var expressValidator = require('express-validator');
    var flash = require('connect-flash');
    var session = require('express-session');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;


var routes = require('./login/index');
var users = require('./login/users');

    // View Engine
    runningApp.disable("x-powered-by");
    runningApp.set('views', path.join(__dirname, 'views'));
    runningApp.engine('handlebars', exphbs({defaultLayout:'layout'}));
    runningApp.set('view engine', 'handlebars');

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
    runningApp.use(passport.initialize());
    runningApp.use(passport.session());

    // Setup Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(configDB.url);

// Express Validator
runningApp.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
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
    runningApp.use('/', routes);
    runningApp.use('/users', users);

    //Define tcp comms
    var client = require('communicator/client');
    client.openConnection();

    if (typeof callback === 'function') {
        callback(runningApp);
    }
};
