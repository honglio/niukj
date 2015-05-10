/**
 * Module dependencies
 */
require('should');
var request = require('supertest');
var app = require('../../../app');

describe('Routes: Errors', function() {
  describe('GET /404:HTML Page', function() {
    it('should response 404 status and render corresponding message', function(done) {
      request(app)
        .get('/niukj-asdf')
        .expect(404)
        .end(function(err, res) {
          res.text.should.containEql('404错误');
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
