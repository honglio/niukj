/**
 * Module dependencies
 */
var request = require('supertest');
var app = require('../../../app');

describe('Routes: Home', function() {
  describe('GET /', function() {
    it('should correct render page', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.text.should.containEql('展书');
          done();
        });
    });
  });
});
