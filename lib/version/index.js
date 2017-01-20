var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  router.use(passport.authenticate('localapikey', { session: false }))
  router.callbacks = require('./controllers/versions')
  router.get('/', router.callbacks.fetchVersion)
  return router
}
