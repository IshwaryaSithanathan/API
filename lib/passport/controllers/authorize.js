var LocalStrategy = require('passport-local').Strategy;
var UserDetails = require('../models/usersLogin');

    module.exports = function (passport) {

    passport.use(new LocalStrategy(
    function(username, password, done) {
    UserDetails.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }else{
            return done(null, user);
            }
    });
    }));

    passport.serializeUser(function(user, done) {
    done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
    UserDetails.getUserById(id, function(err, user) {
        done(err, user);
    });
    });
 
};
