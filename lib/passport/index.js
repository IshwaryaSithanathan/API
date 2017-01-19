
 module.exports = function(passport) {
     exports.controllers = require('./controllers/authenticate')(passport);
 }
