var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , utils = require('../../lib/utils')
  , extend = require('util')._extend
  , math2 = require('../../lib/math2')
  , config = require('../../config/config');

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.article = article;
    next();
  });
};

/**
 * Search
 */

exports.search = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 8;
  var options = {
    perPage: perPage,
    page: page,
    criteria: {fileName: req.query.q}
  };

  console.log(page);

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    console.log(utils.formatDate);
    res.render('article/index', {
      title: '搜索到的课件',
      articles: articles,
      page: page + 1,
      pages: Math.ceil(articles.length / perPage),
      formatDate: utils.formatDate
    });
  });
};

/**
 * Explore Slides
 */
exports.explore = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 8;
  var options = {
    perPage: perPage,
    page: page,
    options: {limit: 50}
  };

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    res.render('article/index', {
      title: '探索课件',
      articles: articles,
      page: page + 1,
      pages: Math.ceil(articles.length / perPage),
      formatDate: utils.formatDate
    });
  });
};

/**
 * List My Slides
 */

exports.my = function(req, res){

  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 8;

  var options = {
    perPage: perPage,
    page: page,
    criteria: {user: req.user}
  };

  console.log(page);

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    res.render('article/index', {
      title: '我的课件',
      articles: articles,
      page: page + 1,
      pages: Math.ceil(articles.length / perPage),
      formatDate: utils.formatDate
    });
  });
};

/**
 * New article
 */

exports.new = function(req, res){
  res.render('article/edit', {
    title: '创建课件',
    article: new Article({})
  });
};

/**
 * Create an article
 */

exports.create = function (req, res, next) {

  var article = new Article(req.body.article);
  article.user = req.user;
  // console.log(article);

  article.save(function (err) {
    if (err) return next(err);
    req.flash('successful', {msg: 'Successfully created article!'});
    return res.send(article._id);
  });

};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('article/edit', {
    title: '编辑课件' + req.article.fileName,
    oss: config.oss
  });
};

/**
 * Update article
 */

exports.update = function(req, res, next){
  // console.log(req.body);
  var article = req.article;
  article = extend(article, req.body.article);
  // console.log(article);
  article.save(function(err) {
    if (err) return next(err);
    return res.send(article._id);
  });
};

exports.getContent = function(req, res) {
  res.send(req.article);
}

/**
 * Show
 */

exports.show = function(req, res){
    res.render('article/post', {
      article: req.article,
      oss: config.oss,
      formatDate: utils.formatDate
    });
};

/**
 * Present
 */

exports.present = function(req, res){
  var cnt = 0,
      slides = req.article.slides;

  slides.forEach(function(slide) {
      var x = slide.x;
      var y = slide.y;

      if (x == null) {
          // adjust the distance between slides during display
          slide.x = cnt * 1100 + 30;
      }
      cnt += 1;
  });

  res.render('article/present', {
    title: '放映课件' + req.article.fileName,
    article: req.article,
    Math2: math2
  });
};

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article;
  article.remove(function(err){
    req.flash('inform', {msg: 'Deleted successfully'});
    res.redirect('/articles');
  });
};

exports.postViewNum = function(req, res) {
  var accountId = req.params.id == 'me'
                    ? req.session.accountId
                    : req.params.id;
  var viewNum = req.param('viewNum', null);

  if( null == viewNum ) {
    res.send(400);
    return;
  }

  Account.findById(accountId, function(account) {
    if ( account ) {
      account.viewNum += 1;
      account.save();
    }
  });
  res.send(200);
};