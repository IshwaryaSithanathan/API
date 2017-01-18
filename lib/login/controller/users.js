var router = require('express').Router({ mergeParams: true });
var passport = require('passport');
var UserDetails = require('../models/users');
var loginTemplate = __dirname + '/../views/login';
var firstPageTemplate = __dirname + '/../views/index';
var exports = module.exports;
router.login    = require('../../passport/login');
var LocalStrategy = require('passport-local').Strategy;


exports.getLogin = function(req,res){

	res.render(loginTemplate);

};



exports.nextPage = function(req,res){
passport.authenticate('local', {successRedirect:'/index', failureRedirect:'/',failureFlash: true})

res.redirect('/index');
}

exports.logout = function(req,res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
}


exports.renderPage = function(req,res){
	res.render(firstPageTemplate);
}
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

// Get Homepage
/*router.get('/index', ensureAuthenticated, function(req, res){
	res.render(firstPageTemplate);
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}*/
//};

