require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function(runningApp, callback) {

    var mongoose = require('mongoose');
    var passport = require('passport');
    var configDB = require('database');

    runningApp.disable("x-powered-by");
    runningApp.set('view engine', 'handlebars');
    runningApp.engine('handlebars', require('hbs').__express);

    // Initialize Passport
    require('passport/index')(passport);
    runningApp.use(passport.initialize());

    // Setup Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(configDB.url);

    // Load routes
    var versionRoute = require('version')(passport);
    var apiRoute = require('api')(passport);

    // Assign routes
    runningApp.use('/version', versionRoute);
    runningApp.use('/api', apiRoute);

    //Define tcp comms
    var client = require('communicator/client');
    client.openConnection();

    if (typeof callback === 'function') {
        callback(runningApp);
    }
};
