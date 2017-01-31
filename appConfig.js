require('app-module-path').addPath(require('path').join(__dirname, '/lib'))


exports.setup = function (runningApp, callback) {
  var mongoose = require('mongoose')
  var passport = require('passport')
  var flash = require('connect-flash')
  var session = require('express-session')
  var exphbs = require('express-handlebars')
  var path = require('path')
  var database = require('database')
 
  runningApp.disable('x-powered-by')
  runningApp.set('view engine', 'handlebars')
  runningApp.engine('handlebars', exphbs({ defaultLayout: 'layout' }))

    // Express Session
  runningApp.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }))

    // Set Static Folder
  runningApp.use(require('express').static(path.join(__dirname, 'public')))


  // *** Initialize Passport ***
  require('passport/index')(passport)
  runningApp.use(passport.initialize())
  runningApp.use(passport.session())

    // Connect Flash
  runningApp.use(flash())

    // Global Vars
  runningApp.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
  })


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
  require('communicator').openConnection()

  // *** Load routes ***
  var versionRoute = require('version')(passport)
  var apiRoute = require('api')(passport)
  var jobsRoute = require('job')(passport)
  var loginRoute = require('login')(passport)

  // *** Assign routes ***
  runningApp.use('/version', versionRoute)
  runningApp.use('/api', apiRoute)
  runningApp.use('/jobs', jobsRoute)
  runningApp.use('/', loginRoute)

  if (typeof callback === 'function') {
    callback(runningApp)
  }
}
