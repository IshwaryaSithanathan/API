var LocalStrategy = require('passport-local').Strategy
var UserDetails = require('../models/login')
var ensureAuthenticated = function ensureAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/')
  } next()
}
module.exports = function (passport) {
  passport.use(new LocalStrategy(
        function (username, password, done) {
          UserDetails.getUserByUsername(username, function (err, user) {
            if (err) throw err
            if (!user) {
              return done(null, false, { message: 'Unknown User' })
            } if (user.password !== password) {
              return done(null, false, {message: 'Incorrect password'})
            }
            return done(null, user)
          })
        }))

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    UserDetails.getUserById(id, function (err, user) {
      done(err, user)
    })
  })
  passport.ensureAuthenticated = ensureAuthenticated
}
