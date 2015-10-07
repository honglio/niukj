var mongoose = require('mongoose'),
    Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function(req, res) {
    var criteria = {
        tags: req.params.tag,
        draft: false
    };
    var perPage = 5;
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    };

    Article.list(options, function(err, articles) {
        if (err) {
            return res.sendStatus(500);
        }
        Article.count(criteria).exec(function(err, count) {
            res.render('article/index', {
                title: '标签 ' + req.params.tag,
                articles: articles,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
};

exports.create = function(req, res) {
    var article = req.article;

    // if (!req.body.tags) {
    //     return res.redirect('/articles/' + article.id + '/manage');
    // }

    article.addTag(req.body.tags, function(err) {
        if (err) {
            req.flash('errors', {
                msg: '更新课件信息失败！'
            });
            return res.render('500');
        }
        req.flash('successful', {
            msg: '更新课件信息成功！'
        });
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
                msg: '错误! 标签未找到。'
            });
        } else {
            req.flash('inform', {
                msg: '删除标签成功。'
            });
        }
        res.redirect('/articles/' + article.id + '/manage');
    });
};
