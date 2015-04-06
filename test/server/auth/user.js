/**
 * Module dependencies
 */
var should = require('should');
var Auth = require('../../../lib/server/controllers/auth');
var createUser = require('./support').createUser;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

describe('User', function() {

  it('should be able to register', function(done) {
    createUser(function(err, response, body) {
      should(!!err).equal(false);
      should(!!body).equal(true);
      console.log(body);
      var json = JSON.parse( body );
      should(json.result).equal(true);
      done();
    });
  });

});
