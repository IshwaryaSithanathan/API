var request = require('supertest')
var server = require('../support/server')
var chai = require('chai')
var expect = chai.expect
var UserModel = require('passport/models/user')
var TokenModel = require('passport/models/token')
var tokenId
var userId

describe('Testing API requests - key validity for only 30 days', function () {
  var app = null
  before(function (done) {
    app = server.express()
    server.beforeEach(app, function () {
      done()
    })
  })
  it('Access API URI', function (done) {
    request(app)
      .get('/api/')
      .expect(200, done)
  })
  it('Cannot generate key as user id not specified returns 400 error', function (done) {
    request(app).get('/api/getToken').set({'userid': ''}).end(function (err, res) {
      if (err) {
        return err
      }
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it('Cannot generate key as user id is incorrect returns 401 unauthorized', function (done) {
    request(app).get('/api/getToken').set({'userid': 'aasdsadasdasd'}).end(function (err, res) {
      if (err) {
        return err
      }
      expect(res.statusCode).to.equal(401)
      done()
    })
  })
  it('Creates a temp user and generates a token and validates it', function (done) {
    var tokenValue = null
    var tokenExpires = null
    var user = new UserModel()
    user.email = 'test@structo3d.com'
    user.name = 'TestUser'
    user.save(function (err) {
      if (err) { return err }
    })
    userId = user._id
    request(app).get('/api/getToken').set({'userid': user._id}).end(function (err, res) {
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
      expect(tokenExpires).to.eql(2592000)
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
    done()
  })
  after(function (done) {
    UserModel.findOneAndRemove({_id: userId}, function (err, user) {
      if (err) {
        console.log(err)
      }
    })
    done()
  })
})
