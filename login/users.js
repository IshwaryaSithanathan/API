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
var UserDetails = mongoose.model('userInfo', UserDetail);


// Login
router.get('/login', function(req, res){
	res.render('login');
});

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
                        return done(null, false,{message: 'Invalid password'});
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
/*passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));*/



router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),

  function(req, res) {
      req.flash('failure_msg', 'errrr');
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;