var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  router.callbacks = require('./controller/users')
  router.get('/', router.callbacks.getLogin)
  router.post('/login', passport.authenticate('local', {successRedirect: '/home', failureRedirect: '/', failureFlash: true}))
  router.get('/home', passport.ensureAuthenticated, router.callbacks.renderPage)
  router.get('/logout', router.callbacks.logout)

  return router
}
