var request = require('supertest')

var server = require('../support/server')
var chai = require('chai')


describe('home document', function () {
  var app = null

  beforeEach(function (done) {
    app = server.express()
    server.beforeEach(app, function () {
      done()
    })
  })

  it('responds to / with a 200 OK', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should have proper headers', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
      .expect(function (res) {
        res.headers.should.have.properties(['content-type', 'etag'])
      })
  })

  it('should have proper text/html content-type', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
      .expect(function (res) {
        res.headers['content-type'].should.equal('text/html; charset=utf-8')
      })
  })

  it('response body should be empty', function (done) {
    var expect = chai.expect
    request(app)
      .get('/')
      .expect(200, done)
      .expect(function (res) {
        expect(res.body).to.be.empty
        expect(res.text).to.be.a('string')
      })
  })

  it('response body should be a HTML string', function (done) {
    var expect = chai.expect
    request(app)
      .get('/')
      .expect(200, done)
      .expect(function (res) {
        expect(res.text).to.be.a('string')
      })
  })

})

