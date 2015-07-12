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
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
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
                msg: 'Success! You are logged in.'
            });
            // res.redirect(req.session.returnTo || '/');
            res.redirect('/articles');
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
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

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
                msg: 'Account with that email address already exists.'
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
                    msg: 'Password reset token is invalid or has expired.'
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
    req.assert('password', 'Password must be alphanumeric').isAlphanumeric();
    req.assert('password', 'Password must be at least 6 characters long.').len(6, 14);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

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
                            msg: 'Password reset token is invalid or has expired.'
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
                from: 'info@niukj.com',
                subject: 'Your Relax password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('successful', {
                    msg: 'Success! Your password has been changed.'
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
    req.assert('email', 'Please enter a valid email address.').isEmail();

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
                        msg: 'No account with that email address exists.'
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
                from: 'info@niukj.com',
                subject: 'Reset your password on Relax',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the' +
                    ' password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('inform', {
                    msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
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
