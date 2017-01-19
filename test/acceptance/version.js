var request = require('supertest')
var server = require('../support/server')

describe('Version API requests', function () {
  var app
  before(function (done) {
    app = server.express()
    server.beforeEach(app, function () {
      done()
    })
  })
  it('responds to / with a 401 Unauthorized - without key', function (done) {
    request(app)
      .get('/version/')
      .expect(401, done)
  })
  it('responds to / with a 401 Unauthorized - with a dummy key', function (done) {
    request(app)
      .get('/version/')
      .set('apikey', 'ThXat60vCgCrf365qLwfpn5Alc6vQVia')
      .expect(401, done)
  })
})
