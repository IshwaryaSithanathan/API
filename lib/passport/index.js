module.exports = function (passport) {
    exports.controllers = require('./controllers/authenticate')(passport);
    exports.controllers = require('./controllers/authorize')(passport);
}
