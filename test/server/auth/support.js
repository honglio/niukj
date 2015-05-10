/**
 * Module dependencies.
 */
var Account = require('../../../server/models/Account');
var Auth = require('../../../server/controllers/auth');

// support

var password = exports.password = 'test';

exports.createUser = function(done) {
  var email = Math.random().toString(32).substr(6) + '@test.com';
  // var mobile = '13829' + Math.floor( 100000 + Math.random() * 900000 );
  var profile = {
    email: email,
    password: password,
    confirmPassword: password
  };
  Auth.createUser(profile, done);
};


