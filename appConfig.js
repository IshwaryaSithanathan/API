require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function(runningApp, callback) {
    var mongoose = require('mongoose');
    var passport = require('passport');
    var configDB = require('database');
    var flash = require('connect-flash');
    var session = require('express-session');
    var exphbs = require('express-handlebars');
    var path = require('path');

    runningApp.disable("x-powered-by");
    runningApp.set('view engine', 'handlebars');
    runningApp.engine('handlebars', exphbs({ defaultLayout: 'layout' }));

    // Set Static Folder
    runningApp.use(require('express').static(path.join(__dirname, 'public')));

    // Initialize Passport
    require('passport/index')(passport);
    runningApp.use(passport.initialize());
    runningApp.use(passport.session());

    // Express Session
    runningApp.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true
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

    // Setup Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(configDB.url);

    // Load routes
    var versionRoute = require('version')(passport);
    var apiRoute = require('api')(passport);
    var loginRoute = require('login')(passport);

    // Assign routes
    runningApp.use('/version', versionRoute);
    runningApp.use('/api', apiRoute);
    runningApp.use('/', loginRoute);

    //Define tcp comms
    var client = require('communicator/client');
    client.openConnection();

    if (typeof callback === 'function') {
        callback(runningApp);
    }
};