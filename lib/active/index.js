var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  router.use(passport.authenticate('localapikey', { session: false }))
  router.callbacks = require('./controllers/active')
  router.get('/', router.callbacks.fetchActiveJob)
  return router
}
