var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy
var User = require('./models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

    /*passport.use(new BearerStrategy({}, // Another similar strategy, but does not allow to pass key via header.
		function(token, done){
			User.findOne({ _id: token }, function(err, user){
				if(!user){
					return done(null, false);
                }
				return done(null, user);
			});
	}));*/
     
    passport.use(new LocalAPIKeyStrategy(
    function(apikey, done) {
        User.findOne({ _id: apikey }, function(err, user){
            if(!user){
                return done(null, false);
            }
            return done(null, user);
        });
    }
    ));
};