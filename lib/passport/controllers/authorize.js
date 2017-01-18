var LocalStrategy = require('passport-local').Strategy;
var UserDetails = require('../models/usersLogin');

module.exports = function(passport) {

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        UserDetails.findOne({
            'username': username,
        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false,{message: 'Unknown User'});
            }

            if (user.password != password) {
                return done(null, false,{message: 'Incorrect password'});
            }
            return done(null, user);
        });
    });
}));

};
