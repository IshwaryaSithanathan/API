var express = require('express');
var router = require('express').Router({ mergeParams: true });
module.exports = router
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserDetails = require('./models/users');
var loginTemplate = __dirname + '/views/login';
var firstPageTemplate = __dirname + '/./views/index';

// Login
router.get('/login', function(req, res){
	res.render(loginTemplate);
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),

  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render(firstPageTemplate);
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = router;