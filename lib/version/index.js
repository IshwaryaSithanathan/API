var router = require('express').Router({ mergeParams: true });
var Promise = require('promise');

module.exports = function(passport) {

    router.use(passport.authenticate('localapikey', { session: false }));

    router.get('/', function(req, res) {
        return new Promise(function(fulfill, reject) {
            try {
                fulfill(res.json({ 'api_version': 'v2', 'printqueue_version': 'v1.3.2', 'firmware_version': 'ortho_v2' }));
            } catch (ex) {
                reject(ex);
            }
        });
    });
    return router;
}
