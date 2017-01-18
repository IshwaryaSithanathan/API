var LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy
var User = require('../models/user')
var Token = require('../models/token')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  passport.use(new LocalAPIKeyStrategy(
        function (apikey, done) {
          Token.findOne({ value: apikey }).populate('user').exec(function (err, token) {
            if (err) {
              return done(null, false)
            }
            if (!token) {
              return done(null, false)
            }
            return done(null, token)
          })
        }
    ))
}
