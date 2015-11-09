var async = require('async');
var config = require('../../config/config');
var querystring = require('querystring');
var request = require('request');
var Linkedin = require('node-linkedin')(config.linkedin.clientID, config.linkedin.clientSecret, config.linkedin.callbackURL);
var Renren = require('passport-weibo');
var _ = require('underscore');
var fs = require('fs');

/**
 * GET /api/weibo
 * Weibo API example.
 */

exports.getWeibo = function(req, res, next) {
    var token = _.findWhere(req.user.tokens, {
        kind: 'weibo'
    });
    async.parallel({
            getMe: function(done) {
                token(done);
            },
            getMyFriends: function(done) {
                token(done);
            }
        },
        function(err, results) {
            if (err) {
                return next(err);
            }
            res.render('api/weibo', {
                title: 'Weibo API',
                me: results.getMe,
                friends: results.getMyFriends
            });
        });
};

/**
 * GET /api/renren
 * Renren API example.
 */

exports.getRenren = function(req, res, next) {
    var token = _.findWhere(req.user.tokens, {
        kind: 'renren'
    });
    var R = new Renren({
        consumer_key: config.renren.consumerKey,
        consumer_secret: config.renren.consumerSecret,
        access_token: token.accessToken,
        access_token_secret: token.tokenSecret
    });
    R.get('search/tweets', {
        q: 'hackathon since:2013-01-01',
        geocode: '40.71448,-74.00598,5mi',
        count: 50
    }, function(err, reply) {
        if (err) {
            return next(err);
        }
        res.render('api/renren', {
            title: 'Renren API',
            tweets: reply.statuses
        });
    });
};

/**
 * GET /api/qq
 * QQ API example.
 */

exports.getQQ = function(req, res, next) {
    var query = querystring.stringify({
        'api-key': config.qq.key,
        'list-name': 'young-adult'
    });
    var url = 'http://api.qq.com/svc/books/v2/lists?' + query;
    request.get(url, function(error, request, body) {
        if (request.statusCode === 403) {
            return next(Error('Missing or Invalid QQ API Key'));
        }
        var bestsellers = JSON.parse(body);
        res.render('api/qq', {
            title: 'QQ API',
            books: bestsellers.results
        });
    });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */

exports.getLinkedin = function(req, res, next) {
    var token = _.findWhere(req.user.tokens, {
        kind: 'linkedin'
    });
    var linkedin = Linkedin.init(token.accessToken);

    linkedin.people.me(function(err, $in) {
        if (err) {
            return next(err);
        }
        res.render('api/linkedin', {
            title: 'LinkedIn API',
            profile: $in
        });
    });
};

/**
 * GET /api/upload
 * Image upload API when user signup.
 */
exports.postImage = function(req, res, next) {
    console.log(req.body);
    console.log(req.files.file);
    var callback = function(err, response, body) {
        if (response.statusCode.toString() === '404') {
            return res.status(404).end('404 无法访问');
        }
        if (err) {
            res.status(400).end('Bad Request');
            return next(err);
        }
        if (body) {
            console.log('body:' + body);
        }
        var json = JSON.parse(body);

        if (json.picture && !json.picture.result) {
            return res.status(400).end("上传失败");
        }
        req.session.bcImage = json.picture.path;
        console.log(req.session);
        // TODO: end with a json?
        res.status(200).end("上传成功");
    };
    // console.log(config);
    var api = request.post(config.apiurl + 'passports/upload/', callback);
    var form = api.form();
    form.append('picture', fs.createReadStream(req.files.file.path));
    // var image = req.files.business_card;
    // form.append('picture', fs.createReadStream(image.path));
};


exports.addBrand = function(req, res, next) {
    request({
            method: 'POST',
            uri: config.apiurl + "demands/",
            json: req.body
        },
        function(err, response, body) {
            if (err) {
                return next(err);
            }
            console.log(body);
            var json = JSON.parse(body);
            res.json(json);
        });
};

/**
 * GET /malls/3/avg_price
 */
exports.getAvgPrice = function(req, res) {
    console.log(' *** getAvgPrice *** ');
    request.get(config.apiurl + 'malls/3/avg_price', function(err, response, body) {
        if (err) {
            return console.log(' *** getAvgPrice error *** ');
        }
        console.log(JSON.parse(body));
        res.json(body);
    });
};

exports.getBrandList = function(req, res, next) {
    var callback = function(err, response, body) {
        if (err) {
            return next(err);
        }
        console.log(body);
        var json = JSON.parse(body);
        res.json(json);
    };

    var api = request.post(config.apiurl + 'demands/brand_or_mall_list/', callback);
    var form = api.form();
    form.append('brand', req.body.brand);
};


exports.editAnswersStatus = function (req, res, next) {

  var loopcalls = [];
  
  req.body.forEach(function(item) {
    loopcalls.push(loopcall(item));
  });
  
  function loopcall(item) {
    return function(callback) { // callback could be extend as a function
      sendAnswerStatus(item, callback);
    };
  }
  
  function sendAnswerStatus (item, done) {
    var callback = function(err, response, body) {
      if(err) {
        return console.log('Error!');
      }
      var json = JSON.parse(body);
      done(err, json);
    };
    
    var api = request.post(urlRoot + 'questions/answer', callback);
    var form = api.form();
    form.append('status', item.status);
    form.append('passport', item.passport);
  }
  
  async.parallel(loopcalls, function(err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
}
