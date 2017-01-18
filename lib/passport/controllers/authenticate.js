var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy
var User = require('../models/user');
var Token = require('../models/token');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalAPIKeyStrategy(
        function(apikey, done) {
            Token.findOne({ value: apikey }).populate('user').exec(function(err, token) {
                if (!token) {
                    return done(null, false);
                }
                return done(null, token);
            });
        }
    ));
};
