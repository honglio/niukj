var utils = require('../../lib/utils');

/**
 * Load comment
 */

exports.load = function(req, res, next, id) {
    var article = req.article;
    utils.findByParam(article.comments, {
        id: id
    }, function(err, comment) {
        if (err) {
            return next(err);
        }
        req.comment = comment;
        next();
    });
};

/**
 * Create comment
 */

exports.create = function(req, res) {
    var article = req.article;
    var user = req.user;

    if (!req.body.body) {
        return res.redirect('/articles/' + article.id + '/present');
    }

    article.addComment(user, req.body, function(err) {
        if (err) {
            req.flash('errors', {
                msg: '新建评论失败！'
            });
            return res.sendStatus(403);
        }
        res.redirect('/articles/' + article.id + '/present');
    });
};

/**
 * Delete comment
 */

exports.destroy = function(req, res) {
    var article = req.article;
    article.removeComment(req.param('commentId'), function(err) {
        if (err) {
            req.flash('errors', {
                msg: '出错啦! 评论删除失败。'
            });
        } else {
            req.flash('inform', {
                msg: '评论删除成功。'
            });
        }
        res.redirect('/articles/' + article.id + '/present');
    });
};
