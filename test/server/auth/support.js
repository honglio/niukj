/**
 * Module dependencies.
 */
var Auth = require('../../../server/controllers/auth');

// support

var password = module.exports.password = 'test';

module.exports.createUser = function(done) {
  var email = 'test-' + Math.random().toString(32).substr(6) + '@test.com';
  // var mobile = '13829' + Math.floor( 100000 + Math.random() * 900000 );
  var profile = {
    email: email,
    password: password,
    confirmPassword: password
  };
  Auth.postSignup(profile, done);
};


