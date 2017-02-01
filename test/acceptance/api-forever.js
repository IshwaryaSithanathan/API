var request = require('supertest')
var server = require('../support/server')
var chai = require('chai')
var expect = chai.expect
var UserModel = require('passport/models/user')
var TokenModel = require('passport/models/token')
var tokenId
var user

describe('Testing API - forever', function () {
  var app = null
  before(function (done) {
    app = server.express()
    user = new UserModel()
    user.email = 'testanother@structo3d.com'
    user.name = 'TestAnother'
    user.save(function (err) {
      if (err) { return err }
    })
    server.beforeEach(app, function () {
      done()
    })
  })
  it('Creates a temp user, generates never expire token and validates it', function (done) {
    var tokenValue = null
    var tokenExpires = null
    request(app).get('/api/getToken').set({'userid': user._id, 'forever': true}).end(function (err, res) {
      if (err) {
        return err
      }
      expect(res.statusCode).to.equal(200)
      tokenId = res.body.user.token
      expect(tokenId).to.not.be.null
      tokenValue = res.body.key
      expect(tokenValue).to.not.be.null
      tokenExpires = res.body.keyExpiry
      expect(tokenExpires).to.not.be.null
      expect(tokenExpires).to.eql(-1)
      request(app).get('/api/').set({'apikey': tokenValue}).end(function (err, res) {
        if (err) {
          return err
        }
        expect(res.statusCode).to.equal(200)
        expect(res.body.message).to.eql('Token valid')
        expect(res.body.expiry).to.not.be.null
        TokenModel.findOneAndRemove({_id: tokenId}, function (err, token) {
          if (err) {
            console.log(err)
          }
        })
      })
    })
    TokenModel.findOneAndRemove({_id: tokenId}, function (err, token) {
      if (err) {
        console.log(err)
      }
    })
    done()
  })
  after(function (done) {
    UserModel.findOneAndRemove({_id: user._id}, function (err, user) {
      if (err) {
        console.log(err)
      }
    })
    done()
  })
})
