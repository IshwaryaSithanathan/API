
var multer = require('multer')
var upload = multer()
var router = require('express').Router({ mergeParams: true })

module.exports = function (passport) {
  router.use(passport.authenticate('localapikey', { session: false }))
  router.callbacks = require('./controller/job')
  router.post('/upload', upload.single(), router.callbacks.uploadJob)
  router.get('/', router.callbacks.fetchJobs)
  router.get('/:id', router.callbacks.fetchJob)
  router.delete('/:id', router.callbacks.deleteJob)

  return router
}

