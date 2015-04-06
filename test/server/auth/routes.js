/**
 * Module dependencies
 */
var should = require('should');
var request = require('supertest');
var support = require('./support');
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

  // [
  //   '/account',
  //   '/logout'
  // ].forEach(function(route) {
  //   it('should redirect to / on GET ' + route, function(done) {
  //     request(app)
  //       .get(route)
  //       .expect(302)
  //       .expect('location', /\//)
  //       .end(done);
  //   });
  // });

  // it('should render forgot on GET /reset/wrongtoken', function(done) {
  //   request(app)
  //     .get('/reset/wrongtoken')
  //     .expect(302)
  //     .expect('location', /\/forgot/)
  //     .end(done);
  // });

  // it('should redirect to previous page after login', function(done) {
  //   request(app)
  //     .get('/login?redirectTo=/test-page')
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
      support.createUser(function(err, response, body) {
        if (err) {
          return done(err);
        }
        // console.log( "======" + body );
        var json = JSON.parse( body );
        console.log(json);
        should(json.result).equal(true);

        user = json.info;
        done();
      });
    });
    // after(function(done) {
      // user.destroy(done);
    // });

    function login(password) {
      return request(app)
        .post('/login')
        .send({
          username: user.email,
          password: password
        });
    }

    it('can login', function(done) {
      // console.log(support.password);
      login(support.password)
        .expect(302)
        .expect('location', /\/loginOK/)
        .end(done);
    });
    [0, null, 'wrong password', '', undefined].forEach(function(password) {

      it('cannot login with password : ' + password, function(done) {
        login(password)
          .expect(302)
          .expect('location', /\//)
          .end(done);
      });

    });

  });

  describe('logged user', function() {
    var user;
    var cookies;
    before(function(done) {
      //create user
      support.createUser(function(err, response, body) {
        if (err) {
          return done(err);
        }
        var json = JSON.parse( body );
        console.log(json);
        should(json.result).equal(true);

        user = json.info;
        //log user
        request(app)
          .post('/login')
          .send({
            username: user.email,
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

    // after(function(done) {
    //   logged('/destroy')
    //     .expect(302)
    //     .end(done);
    //   //user.destroy(done);
    // });

    function logged(route) {
      return request(app)
        .get(route)
        .set('Cookie', cookies);
    }

    it('should see page on GET /activityShare', function(done) {
      logged('/activityShare')
        .expect(200)
        .end(function(err, res) {
          // console.log(err);
          if (err) {
            return done(err);
          }
          // console.log(res);
          res.text.should.include('了解方橙');
          done();
        });
    });

    it('should see page on GET /questionTemplate', function(done) {
      logged('/questionTemplate')
        .expect(200)
        .end(done);
    });

    it('should see page on GET /submitAnswer', function(done) {
      logged('/submitAnswer')
        .expect(302)
        .expect('location', /\//)
        .end(done);
    });

  });

});
