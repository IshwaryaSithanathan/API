require('app-module-path').addPath(require('path').join(__dirname, '/lib'))

exports.setup = function (runningApp, callback) {
  var mongoose = require('mongoose')
  var passport = require('passport')
  var database = require('database')

  runningApp.disable('x-powered-by')
  runningApp.set('view engine', 'handlebars')
  runningApp.engine('handlebars', require('hbs').__express)

  // *** Initialize Passport ***
  require('passport/index')(passport)
  runningApp.use(passport.initialize())

  // *** Setup Mongoose ***
  // Creates a single DB connection, application unable to connect if set to createconnection.
  // Mocha tests are failing without createconnection. Definitely not the best fix, can revisit this.
  mongoose.Promise = global.Promise
  try {
    mongoose.connect(database.url)
  } catch (err) {
    mongoose.createConnection(database.url)
  }

  // *** Setup TCP communication with PrintQueue ***
  var communicatorRoute = require('communicator')
  communicatorRoute.openConnection()

  // *** Load routes ***
  var versionRoute = require('version')(passport)
  var apiRoute = require('api')(passport)
  var jobsRoute = require('jobs')(passport)

  // *** Assign routes ***
  runningApp.use('/version', versionRoute)
  runningApp.use('/api', apiRoute)
  runningApp.use('/jobs', jobsRoute)

  if (typeof callback === 'function') {
    callback(runningApp)
  }
}
