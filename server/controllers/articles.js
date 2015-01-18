var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    utils = require('../../lib/utils'),
    _ = require('underscore'),
    math2 = require('../../lib/math2'),
    config = require('../../config/config');

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    Article.load(id, function(err, article) {
        if (err) {
            return next(err);
        }
        if (!article) {
            return next(new Error('not found'));
        }
        req.article = article;
        next();
    });
};

/**
 * Search
 */

exports.search = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 8;
    var options = {
        perPage: perPage,
        page: page,
        criteria: {
            fileName: req.query.q
        }
    };
    var amount;

    Article.list(options, function(err, articles) {
        if (err) {
            return res.render('500');
        }
        // console.log(utils.formatDate);
        Article.count().exec(function(err, count) {
            if (count > perPage && articles.length < perPage) {
                amount = articles.length + perPage * page;
            } else {
                amount = count;
            }
            res.render('article/index', {
                title: '搜索到的课件',
                articles: articles,
                page: page + 1,
                pages: Math.ceil(amount / perPage),
                formatDate: utils.formatDate
            });
        });
    });
};

/**
 * Explore Slides
 */
exports.explore = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 8;
    var options = {
        perPage: perPage,
        page: page,
        options: {
            limit: 50
        }
    };
    var amount;

    Article.list(options, function(err, articles) {
        if (err) {
            return res.render('500');
        }
        Article.count().exec(function(err, count) {
            // console.log(options.page);
            // console.log(count);
            // console.log(articles.length);
            if (count > perPage && articles.length < perPage) {
                amount = articles.length + perPage * page;
            } else {
                amount = count;
            }

            res.render('article/index', {
                title: '探索课件',
                articles: articles,
                page: page + 1,
                pages: Math.ceil(amount / perPage),
                formatDate: utils.formatDate
            });
        });
    });
};

/**
 * List My Slides
 */

exports.my = function(req, res) {

    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 8;
    var options = {
        perPage: perPage,
        page: page,
        criteria: {
            user: req.user
        }
    };
    var amount;

    Article.list(options, function(err, articles) {
        if (err) {
            return res.render('500');
        }
        Article.count().exec(function(err, count) {
            if (count > perPage && articles.length < perPage) {
                amount = articles.length + perPage * page;
            } else {
                amount = count;
            }
            res.render('article/index', {
                title: '我的课件',
                articles: articles,
                page: page + 1,
                pages: Math.ceil(amount / perPage),
                formatDate: utils.formatDate
            });
        });
    });
};

/**
 * New article
 */

exports.new = function(req, res) {
    res.render('article/edit', {
        title: '创建课件',
        article: new Article({})
    });
};

/**
 * Create an article
 */

exports.create = function(req, res, next) {

    var article = new Article(req.body.article);
    article.user = req.user;
    // console.log(article);

    article.save(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('successful', {
            msg: 'Successfully created article!'
        });
        return res.send(article._id);
    });

};

/**
 * Edit an article
 */

exports.edit = function(req, res) {
    res.render('article/edit', {
        title: '编辑课件' + req.article.fileName,
        oss: config.oss
    });
};

/**
 * Update article
 */

exports.update = function(req, res, next) {
    // req.body.article contain the modified version, but it's only on object without any function.
    // req.article contain the old version, and it's unchangeble. but it has save and update function.
    var article = {};
    _.extend(article, req.body.article);
    // _.defaults(req.body.article, req.article);

    article.hitCounter = req.article.hitCounter;
    article.desc = req.article.desc;
    article.tags = req.article.tags;
    article.comments = req.article.comments;

    Article.updateAndSave(req.article._id, article, function(err) {
        if (err) {
            return next(err);
        }
        return res.send(req.article._id);
    });
};

exports.getContent = function(req, res) {
    res.send(req.article);
};

/**
 * Show
 */

exports.show = function(req, res) {
    res.render('article/post', {
        article: req.article,
        oss: config.oss,
        formatDate: utils.formatDate
    });
};

/**
 * Present
 */
var lastUser = {};
exports.present = function(req, res) {
    var cnt = 0,
        slides = req.article.slides;

    slides.forEach(function(slide) {
        var x = slide.x;
        // var y = slide.y;

        if (x == null) {
            // adjust the distance between slides during display
            slide.x = cnt * 1100 + 30;
        }
        cnt += 1;
    });

    if (req.user) {
        if (lastUser[req.user.email] == null) {
            lastUser[req.user.email] = [];
        }

        if (lastUser[req.user.email].indexOf(req.article.fileName) === -1) {
            req.article.hitCounter += 1;
            req.article.save();
            lastUser[req.user.email].push(req.article.fileName);
        }
    }

    res.render('article/present', {
        title: '放映课件' + req.article.fileName,
        article: req.article,
        Math2: math2,
        timeSince: function(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
            var interval = Math.floor(seconds / 31536000);
            if (interval > 1) {
                return interval + " 年";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " 月";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " 日";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " 小时";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " 分钟";
            }
            return Math.floor(seconds) + " 秒";
        }
    });
};

/**
 * Delete an article
 */

exports.destroy = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Delete failed!'
            });
            res.redirect('/articles/my');
        } else {
            req.flash('inform', {
                msg: 'Deleted successfully!'
            });
            res.redirect('/articles/my');
        }
    });
};
