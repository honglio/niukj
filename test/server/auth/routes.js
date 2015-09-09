/**
 * Module dependencies
 */
var should = require('should');
var request = require('supertest');
var support = require('./support');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var app = require('../../../app');

describe('app', function() {
  it('should render signup on GET /signup', function(done) {
    request(app)
      .get('/signup')
      .expect(200)
      .end(done);
  });
  it('should render login on GET /login', function(done) {
    request(app)
      .get('/login')
      .expect(200)
      .end(done);
  });
  it('should render forgot on GET /forgot', function(done) {
    request(app)
      .get('/forgot')
      .expect(200)
      .end(done);
  });

  // ['facebook', 'google'].forEach(function(provider) {
  //   it('should redirect to facebook on GET /auth/' + provider, function(done) {
  //     request(app)
  //       .get('/auth/' + provider)
  //       .expect(302)
  //       .expect('location', new RegExp(provider + '.com'))
  //       .end(done);
  //   });
  // });

  [
    '/account',
    '/logout'
  ].forEach(function(route) {
    it('should redirect to / on GET ' + route, function(done) {
      request(app)
        .get(route)
        .expect(302)
        .expect('location', /\/login/)
        .end(done);
    });
  });

  it('should render forgot on GET /reset/wrongtoken', function(done) {
    request(app)
      .get('/reset/wrongtoken')
      .expect(302)
      .expect('location', /\/forgot/)
      .end(done);
  });

  // it('should redirect to previous page after login', function(done) {
  //   request(app)
  //     .get('/login?returnTo=/test-page')
  //     .expect(200)
  //     .end(function(err, res) {
  //       if (err) {
  //         return done(err);
  //       }
  //       var cookies = res.headers['set-cookie'].pop().split(';')[0];
  //       request(app)
  //         .get('/auth/success')
  //         .set('Cookie', cookies)
  //         .expect(302)
  //         .expect('location', /\/test-page/)
  //         .end(done);
  //     });
  // });

  describe('registered user', function() {
    var user;
    before(function(done) {
      support.createUser(function(response, body) {
        if (!response) {
          return done('User not created.');
        }
        console.log( body );
        user = body;
        done();
      });
    });
    after(function(done) {
      Account.remove({
          _id: user.id
      }, function(err){
        if(!err) {
          done();
        }
      });
    });

    function login(password) {
      return request(app)
        .post('/login')
        .send({
          email: user.email,
          password: password
        });
    }

    it('can login', function(done) {
      // console.log(support.password);
      login(support.password)
        .expect(302)
        .expect('location', /\/account/)
        .end(done);
    });

    [0, null, 'wrong password', '', undefined].forEach(function(password) {

      it('cannot login with password : ' + password, function(done) {
        login(password)
          .expect(302)
          .expect('location', /\/login/)
          .end(done);
      });

    });

  });

  describe('logged user', function() {
    var user;
    var cookies;
    before(function(done) {
      //create user
      support.createUser(function(response, body) {
        if (!response) {
          return done('User not created.');
        }
        console.log( "======" + body );
        user = body;
        //log user
        request(app)
          .post('/login')
          .send({
            email: user.email,
            password: support.password
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            cookies = res.headers['set-cookie'].pop().split(';')[0];
            done();
            // user.update(done);
          });
      });
    });

    after(function(done) {
      Account.remove({
          _id: user.id
      }, function(err){
        if(!err) {
          done();
        }
      });
    });

    it('should see page on GET /account', function(done) {
      request(app)
        .get('/account')
        .set('Cookie', cookies)
        .expect(200)
        .end(function(err, res) {
          // console.log(err);
          if (err) {
            return done(err);
          }
          console.log(res);
          res.text.should.containEql('粉丝');
          done();
        });
    });

    it('should see page on GET /account', function(done) {
      request(app)
        .get('/account')
        .set('Cookie', cookies)
        .expect(200)
        .end(done);
    });
  });

});
