var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    password: String
}, {
    collection: 'userInfo'
});
var UserDetails = module.exports = mongoose.model('userInfo', UserDetail);

passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
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
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

