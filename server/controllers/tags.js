var mongoose = require('mongoose'),
    Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function(req, res) {
    var criteria = {
        tags: req.param('tag')
    };
    var perPage = 5;
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    };

    Article.list(options, function(err, articles) {
        if (err) {
            return res.render('500');
        }
        Article.count(criteria).exec(function(err, count) {
            res.render('article/index', {
                title: '标签 ' + req.param('tag'),
                articles: articles,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
};

exports.create = function(req, res) {
    var article = req.article;

    if (!req.body.tags) {
        return res.redirect('/articles/' + article.id + '/manage');
    }

    article.addTag(req.body.tags, function(err) {
        if (err) {
            return res.render('500');
        }
        res.redirect('/articles/' + article.id + '/manage');
    });
};

exports.destroy = function(req, res) {
    var article = req.article;

    if (!req.body.tags) {
        return res.redirect('/articles/' + article.id + '/manage');
    }

    article.removeTag(req.body.tags, function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Oops! The tags was not found'
            });
        } else {
            req.flash('inform', {
                msg: 'Removed tags'
            });
        }
        res.redirect('/articles/' + article.id + '/manage');
    });
};
