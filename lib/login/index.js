

var router = require('express').Router({ mergeParams: true });
module.exports = router;
router.models       = require('./models/users');
router.callbacks    = require('./controller/users');

router.get('/', router.callbacks.getLogin);
router.post('/login', router.callbacks.nextPage);
router.get('/index', router.callbacks.renderPage);
router.get('/logout', router.callbacks.logout);