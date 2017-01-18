var request = require('supertest');

var server = require('../support/server');

describe('home document', function() {
  var app;
  beforeEach(function (done) {
    app = server.express();
    server.beforeEach(app, function() {
      done();
    });
  });

  afterEach(function () {

  });

  it('responds to / with a 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should have proper headers', function(done) {
    request(app)
      .get('/')
      .expect(200,done)
      .expect(function(res){
        res.headers.should.have.properties(['content-type','etag']);
      });
  });

  it('should have proper uber+json content-type', function(done) {
    request(app)
      .get('/')
      .expect(200,done)
      .expect(function(res){
        res.headers['content-type'].should.equal('text/html; charset=utf-8');
      });
  });
});
