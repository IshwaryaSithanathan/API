var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
    router.post('/login', passport.authenticate('local', { successRedirect: '/index', failureRedirect: '/' }));
    router.callbacks = require('./controller/users')
    router.get('/index', router.callbacks.renderPage);
    router.get('/logout', router.callbacks.logout);
    router.get('/', router.callbacks.getLogin);
    return router
};


