var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  function ensureAuthenticated (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  router.callbacks = require('./controller/users')
  router.get('/', router.callbacks.getLogin)
  router.post('/login', passport.authenticate('local', {successRedirect: '/home', failureRedirect: '/', failureFlash: true}))
  router.get('/home', ensureAuthenticated, router.callbacks.renderPage)
  router.get('/logout', router.callbacks.logout)

  return router
}
