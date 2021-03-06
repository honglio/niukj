var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');
var _ = require('underscore');
var fs = require('fs');
var config = require('../../config/config');
var OSS = require('aliyun-oss');
var validator = require('validator');

function findByString(searchStr, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    Account.find({
        $or: [{
            'name': {
                $regex: searchRegex
            }
        }, {
            email: {
                $regex: searchRegex
            }
        }]
    }, callback);
}

/***************************************************
 *
 * Account
 *
 ***************************************************/

/**
 * GET /account
 * Profile page.
 */

exports.accountbyId = function(req, res, next) {

    var contactId = req.params.uid;

    // req.assert('uid', 'contactId is not a valid MongoId!').isMongoId();
    // var errors = req.validationErrors();
    // console.log(errors);

    var valid = validator.isMongoId(contactId);
    if (!valid) {
        req.flash('errors', {
            msg: '用户ID不正确!'
        });
        return res.redirect(req.session.returnTo || '/account');
    }

    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 9;
    var options = {
        perPage: perPage,
        page: page,
        criteria: {
            user: req.account
        }
    };
    var amount;

    Article.list(options, function(err, articles) {
        if (err) {
            req.flash('errors', {
                msg: '更新信息失败！'
            });
            return res.sendStatus(403);
        }

        // calculate ViewNum of the reqested account
        var viewNum = 0;
        for (var i in articles) {
            if (articles.hasOwnProperty(i)) {
                viewNum += articles[i].hitCounter;
            }
        }
        req.account.viewNum = viewNum;

        Article.count().exec(function(err, count) {
            if (count > perPage && articles.length < perPage) {
                amount = articles.length + perPage * page;
            } else {
                amount = count;
            }
            if (!req.user) {
                res.render('account/profileById', {
                    title: '用户资料',
                    account: req.account,
                    articles: articles,
                    page: page + 1,
                    pages: Math.ceil(amount / perPage),
                    formatDate: utils.formatDate,
                    followed: false
                });
            } else {
                Account.findById(req.user.id, function(err, user) {
                    // console.log(req.user.id);
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(new Error('not found'));
                    }

                    if (Account.hasFollowing(user, contactId)) {
                        res.render('account/profileById', {
                            title: '用户资料',
                            account: req.account,
                            articles: articles,
                            page: page + 1,
                            pages: Math.ceil(amount / perPage),
                            formatDate: utils.formatDate,
                            followed: true
                        });
                    } else {
                        res.render('account/profileById', {
                            title: '用户资料',
                            account: req.account,
                            articles: articles,
                            page: page + 1,
                            pages: Math.ceil(amount / perPage),
                            formatDate: utils.formatDate,
                            followed: false
                        });
                    }
                });
            }
        });
    });
};

exports.followerbyId = function(req, res, next) {
    req.account.contacts.followers.forEach(function(follower, i) {
        Account.load(follower.accountId, function(err, contact) {
            if (err) {
                return next(err);
            }
            req.account.contacts.followers[i] = contact;
        });
    });

    setTimeout(function() {
        res.render('account/follower', {
            title: '粉丝列表',
            account: req.account
        });
    }, 100);
};

exports.followingbyId = function(req, res, next) {

    req.account.contacts.followings.forEach(function(following, i) {
        Account.load(following.accountId, function(err, contact) {
            if (err) {
                return next(err);
            }
            req.account.contacts.followings[i] = contact;
        });
    });

    setTimeout(function() {
        res.render('account/following', {
            title: '关注列表',
            account: req.account
        });
    }, 100);
};

exports.removeContact = function(req, res, next) {
    var contactId = req.params.uid;

    var valid = validator.isMongoId(contactId);
    if (!valid) {
        req.flash('errors', {
            msg: 'Is not a valid MongoId!'
        });
        return res.redirect(req.session.returnTo || '/account');
    }
    Account.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('not found'));
        }
        Account.findById(contactId, function(err, contact) {
            if (err) {
                return next(err);
            }
            if (!contact) {
                return next(new Error('not found'));
            }

            console.log('Remove Contact:');
            Account.removeFollowing(user, contactId);
            // Kill the reverse link
            Account.removeFollower(contact, req.user.id);

            user.save(function(err) {
                if (err) {
                    console.log('Error saving account: ' + err);
                    return next(err);
                }
            });
            contact.save(function(err) {
                if (err) {
                    console.log('Error saving account: ' + err);
                    return next(err);
                }
            });
            req.flash('successful', {
                msg: 'Contact Removed.'
            });
            return res.redirect('/account/' + contactId);
        });
    });
};


exports.addContact = function(req, res, next) {
    var contactId = req.params.uid;

    var valid = validator.isMongoId(contactId);
    if (!valid) {
        req.flash('errors', {
            msg: '用户ID不正确!'
        });
        return res.redirect(req.session.returnTo || '/account');
    }
    // Missing contactId, don't bother going any further, or
    // contactId is the same as accountId, you can't add yourself as contact.
    if (null == contactId || contactId === req.user.id) {
        req.flash('errors', {
            msg: '不能添加自己。'
        });
        return res.redirect('/account/' + contactId);
    }

    Account.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('not found'));
        }
        Account.findById(contactId, function(err, contact) {
            if (err) {
                return next(err);
            }
            if (!contact) {
                return next(new Error('not found'));
            }
            // console.log('Add Contact:');

            Account.addFollowing(user, contact);
            Account.addFollower(contact, user);

            user.save(function(err) {
                if (err) {
                    // console.log('Error saving account: ' + err);
                    return next(err);
                }
            });
            contact.save(function(err) {
                if (err) {
                    // console.log('Error saving account: ' + err);
                    return next(err);
                }
            });

            req.flash('successful', {
                msg: '添加成功.'
            });
            return res.redirect('/account/' + contactId);
        });
    });
};

exports.findContact = function(req, res) {
    var searchStr = req.query.searchStr;

    if (null == searchStr) {
        res.send(400);
        return;
    }

    findByString(searchStr, function onSearchDone(err, accounts) {
        if (err || accounts.length === 0) {
            res.send(404);
        } else {
            res.send(accounts);
        }
    });
};

/**
 * Load
 */

exports.load = function(req, res, next, id) {
    // req.assert('uid', 'contactId is not a valid MongoId!').isMongoId();
    // var errors = req.validationErrors();
    // console.log(errors);
    var valid = validator.isMongoId(id);
    if (!valid) {
        req.flash('errors', {
            msg: '用户ID不正确!'
        });
        return res.redirect(req.session.returnTo || '/account');
    }
    Account.load(id, function(err, account) {
        if (err) {
            return next(err);
        }
        if (!account) {
            return next(new Error('not found'));
        }
        req.account = account;
        next();
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function(req, res, next) {
    Account.findById(req.user.id, function(err, user) {
        // console.log(req.user);
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';

        user.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('successful', {
                msg: '用户信息更新成功。'
            });
            res.redirect('/account');
        });
    });
};

/**
 * GET /account/uploadProfileImg
 * Image upload API when user manage profile.
 */
exports.uploadProfileImg = function(req, res, next) {
    // console.log(req.files);
    var imgPath = req.files.file.path;
    var filename = req.files.file.name;
    var oss = OSS.createClient(config.oss);
    //   next();
    Account.findById(req.user.id, function(err, user) {
        // console.log(req.user);
        if (err) {
            return next(err);
        }
        oss.putObject({
            bucket: config.oss.bucket.profile,
            object: filename,
            source: imgPath
        }, function(err, response) {
            console.log(err);
            if (err) {
                res.sendStatus(501);
                return next(err);
            }
            console.log(response.objectUrl);
            user.profile.picture.url = response.objectUrl;
            user.profile.picture.name = filename;

            // user.profile.picture.data = fs.readFileSync(imgPath);
            // user.profile.picture.contentType = req.files.file.mimetype;
            user.save(function(err) {
                if (err) {
                    req.flash('errors', {
                        msg: '更新信息失败！'
                    });
                    res.sendStatus(403);
                    return next(err);
                }
                res.sendStatus(200);
            });
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 * @param password
 */

exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', '密码只能包含字母和数字').isAlphanumeric();
    req.assert('password', '密码必须为6到14位').len(6, 14);
    req.assert('confirm', '密码不一致').equals(req.body.password);
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    Account.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }

        user.password = req.body.password;

        user.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('successful', {
                msg: '密码已更改.'
            });
            res.redirect('/account');
        });
    });
};

/**
 * GET /account/manage
 * Send manage account page.
 */

exports.getManage = function(req, res) {
    res.render('account/manage', {
        title: '账户管理'
    });
};

/**
 * POST /account/delete
 * Delete user account.
 * @param id - User ObjectId
 */

exports.postDeleteAccount = function(req, res, next) {
    Account.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        user.remove(function(err, acc) {
            if (err) {
                console.log(err);
                return next(err);
            }
            Account.remove({
                _id: req.user.id
            }, function(err) {
                if (err) {
                    return next(err);
                }
                req.logout();
                res.redirect('/');
            });
        });
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth2 provider from the current user.
 * @param provider
 * @param id - User ObjectId
 */

exports.getOauthUnlink = function(req, res, next) {
    var provider = req.params.provider;
    Account.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }

        user[provider] = undefined;
        user.tokens = _.reject(user.tokens, function(token) {
            return token.kind === provider;
        });

        user.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('inform', {
                msg: provider + ' 账户已经取消关联。'
            });
            res.redirect('/account');
        });
    });
};
