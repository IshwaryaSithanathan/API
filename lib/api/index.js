var router = require('express').Router({ mergeParams: true });
var Promise = require('promise');
var ObjectId = require('mongodb').ObjectID;
var User = require('../passport/models/user');
var Token = require('../passport/models/token');

module.exports = function(passport) {

    // This function will be called by the UI layer for generating tokens.
    // UserID has to be passed in the header for generating the token.
    router.get('/getToken', function(req, res) {
        return new Promise(function(fulfill, reject) {
            try {
                User.findOne({ _id: req.headers.userid }).populate('token').exec(function(err, user) {
                    if (err) {
                        reject(res.sendStatus(401));
                    } else {
                        if (user == null) {
                            reject(res.sendStatus(401));
                            return;
                        }

                        if (user.token == null) {
                            user.generateToken();
                            fulfill(res.json({ "user": user }));
                        } else {
                            fulfill(res.json({ "message": "Token exists", "token": user }));
                        }
                    }
                });
            } catch (ex) {
                reject(res.sendStatus(401));
            }
        });
    });

    // This function will be called by the UI layer for generating tokens.
    // If the api is not available, 401 error will be thrown else the expiring date of the token will be displayed.
    router.get('/', function(req, res) {
        return new Promise(function(fulfill, reject) {
            try {
                var api = req.headers.apikey;
                Token.findOne({ value: api }).populate('user').exec(function(err, token) {
                    if (!token) {
                        return fulfill(res.send({ "message": "Token expired" })); // Might not reach this state. Keeping for safety purposes.
                    }
                    return fulfill(res.send({ "expiry": token.getExpiringDate() }));
                });
            } catch (ex) {
                reject(res.sendStatus(401));
            }
        });
    });

    return router;
}