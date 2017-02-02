var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  router.callbacks = require('./controllers/generators')
  router.get('/getToken', router.callbacks.generateToken)
  router.get('/', router.callbacks.findToken)
  return router
}
