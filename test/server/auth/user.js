/**
 * Module dependencies
 */
var should = require('should');
var createUser = require('./support').createUser;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

describe('User', function() {

  it('should be able to register', function(done) {
    createUser(function(response) {
      should(!!response).equal(true);
      done();
    });
  });

});
