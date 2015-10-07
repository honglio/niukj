var mongoose = require('mongoose');
var User = mongoose.model('Account');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var config = require('../../config/config');
/**
 * POST /login
 * Sign in using email and password.
 * @param email
 * @param password
 */

exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email格式不正确').isEmail();
    req.assert('password', '密码不能为空').notEmpty();
    req.assert('password', '密码必须为6到14位').len(6, 14);
    req.assert('password', '密码只能包含字母和数字').isAlphanumeric();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
            req.flash('errors', {
                msg: info.message
            });
            return res.redirect('/login');
        }

        // add user to session
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            req.flash('successful', {
                msg: '您已登录成功！'
            });
            // res.redirect(req.session.returnTo || '/');
            res.redirect('/account');
        });
    })(req, res, next);
};

/**
 * Create a new local account for Testing.
 * @param profile - email, password
 * @param done - callback
 */
exports.createUser = function(profile, done) {
    var user = new User({
        email: profile.email,
        password: profile.password
    });

    User.findOne({
        email: profile.email
    }, function(err, existingUser) {
        if (existingUser) {
            done(false);
        }
        user.save(function(err) {
            if (err) {
                done(false);
            }
            done(true, user);
        });
    });
};

/**
 * POST /signup
 * Create a new local account.
 * @param email
 * @param password
 */

exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email格式不正确').isEmail();
    req.assert('password', '密码不能为空').notEmpty();
    req.assert('password', '密码必须为6到14位').len(6, 14);
    req.assert('password', '密码只能包含字母和数字').isAlphanumeric();
    req.assert('confirmPassword', '密码不一致').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (existingUser) {
            req.flash('errors', {
                msg: '用户名已存在!'
            });
            return res.redirect('/signup');
        }
        user.save(function(err) {
            if (err) {
                return next(err);
            }
            // add user to session
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/account');
            });
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */

exports.getReset = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    User
        .findOne({
            resetPasswordToken: req.params.token
        })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                req.flash('errors', {
                    msg: '密码重置请求已超时或网址不正确。'
                });
                return res.redirect('/forgot');
            }
            res.render('account/reset', {
                title: '密码重置'
            });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */

exports.postReset = function(req, res, next) {
    req.assert('password', '密码不能为空').notEmpty();
    req.assert('password', '密码只能包含字母和数字').isAlphanumeric();
    req.assert('password', '密码必须为6到14位').len(6, 14);
    req.assert('confirm', '密码不一致').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }

    async.waterfall([
        function(done) {
            User
                .findOne({
                    resetPasswordToken: req.params.token
                })
                .where('resetPasswordExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        req.flash('errors', {
                            msg: '密码重置请求已超时或网址不正确。'
                        });
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
            var mailOptions = {
                to: user.email,
                from: config.mail.auth.user,
                subject: '您在展书的密码已被重置',
                text: '您好,\n\n' +
                    '这是一封确认信：您的账户 ' + user.email + ' 的密码已经被重置。\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('successful', {
                    msg: '您的密码已经被重置！'
                });
                done(err);
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 * @param email
 */

exports.postForgot = function(req, res, next) {
    req.assert('email', 'Email格式不正确').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.email.toLowerCase()
            }, function(err, user) {
                if (!user) {
                    req.flash('errors', {
                        msg: '用户名不存在！'
                    });
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
            var mailOptions = {
                to: user.email,
                from: config.mail.auth.user,
                subject: '展书账户密码重置',
                text: '您收到这封邮件是因为您或者他人请求重置您的账户的密码。\n\n' +
                    '请点击下放链接, or 或者复制粘贴到浏览器的地址栏来完成重置操作:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    '如果不是您做出的请求, 请忽略此邮件，您的账户密码不会更改。\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('inform', {
                    msg: '一封电子邮件已经被发送到 ' + user.email + '。 请根据邮件中的提示操作。'
                });
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/forgot');
    });
};
