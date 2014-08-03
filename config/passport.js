var _ = require('underscore'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('Account'),
    LocalStrategy = require('passport-local').Strategy,
    RenrenStrategy = require('passport-renren').Strategy,
    WeiboStrategy = require('passport-weibo').Strategy,
    QQStrategy = require('passport-tqq').Strategy,
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    config = require('./config');

// serialize sessions
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// login use local strategy
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    function (email, password, done) {
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Email ' + email + ' not found'
                });
            }
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid email or password.'
                    });
                }
            });
        });
    }
));

// use Renren strategy
passport.use(new RenrenStrategy(config.renren, function (req, accessToken, tokenSecret, profile, done) {
    if (req.user) {
        User.findOne({
            renren: profile.id
        }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a RenRen account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.renren = profile.id;
                    user.tokens.push({
                        kind: 'renren',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.picture = user.profile.picture || profile.picture;
                    user.save(function (err) {
                        req.flash('inform', {
                            msg: 'RenRen account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            renren: profile.id
        }, function (err, existingUser) {
            if (existingUser) { return done(null, existingUser); }
            console.log(profile._json);
            // User.findOne({ email: profile._json.emailAddress }, function(err, existingEmailUser) {
            //   if (existingEmailUser) {
            //     req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Weibo manually from Account Settings.' });
            //     done(err);
            //   } else {
            var user = new User();
            user.renren = profile.id;
            user.email = user.email || profile.id + '@example.com';
            user.tokens.push({
                kind: 'renren',
                accessToken: accessToken
            });
            user.profile.name = user.profile.name || profile.displayName;
            user.profile.picture = user.profile.picture || profile.picture;
            user.save(function (err) {
                done(err, user);
            });
            //   }
            // });
        });
    }
}));

// use weibo strategy
passport.use(new WeiboStrategy(config.weibo, function (req, accessToken, tokenSecret, profile, done) {
    if (req.user) {
        User.findOne({
            weibo: profile.id
        }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a Weibo account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.weibo = profile.id;
                    user.tokens.push({
                        kind: 'weibo',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.save(function (err) {
                        req.flash('inform', {
                            msg: 'Weibo account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            weibo: profile.id
        }, function (err, existingUser) {
            if (existingUser) { return done(null, existingUser); }
            console.log(profile._json);
            // User.findOne({ email: profile._json.emailAddress }, function(err, existingEmailUser) {
            //   if (existingEmailUser) {
            //     req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Weibo manually from Account Settings.' });
            //     done(err);
            //   } else {
            var user = new User();
            user.weibo = profile.id;
            user.tokens.push({
                kind: 'weibo',
                accessToken: accessToken
            });
            user.email = user.email || profile.id + '@example.com';
            user.profile.name = user.profile.name || profile.displayName;
            user.save(function (err) {
                done(err, user);
            });
            //   }
            // });
        });
    }
}));

// use QQ strategy
passport.use(new QQStrategy(config.qq, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({
            qq: profile.id
        }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a QQ account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.qq = profile.id;
                    user.tokens.push({
                        kind: 'qq',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.nickname;
                    user.profile.gender = user.profile.gender || profile.gender;
                    user.save(function (err) {
                        req.flash('inform', {
                            msg: 'QQ account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            qq: profile.id
        }, function (err, existingUser) {
            if (existingUser) { return done(null, existingUser); }
            console.log(profile._json);
            // User.findOne({ email: profile._json.emailAddress }, function(err, existingEmailUser) {
            //   if (existingEmailUser) {
            //     req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with QQ manually from Account Settings.' });
            //     done(err);
            //   } else {
            var user = new User();
            user.email = user.email || profile.id + '@example.com';
            user.qq = profile.id;
            user.tokens.push({
                kind: 'qq',
                accessToken: accessToken
            });
            user.profile.name = user.profile.name || profile.nickname;
            user.profile.gender = user.profile.gender || profile.gender;
            user.save(function (err) {
                done(err, user);
            });
            //   }
            // });
        });
    }
}));

// use linkedin strategy
passport.use(new LinkedInStrategy(config.linkedin, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({
            linkedin: profile.id
        }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.linkedin = profile.id;
                    user.tokens.push({
                        kind: 'linkedin',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.location = user.profile.location || profile._json.location.name;
                    user.profile.picture = user.profile.picture || profile._json.pictureUrl;
                    user.profile.website = user.profile.website || profile._json.publicProfileUrl;
                    user.save(function (err) {
                        req.flash('inform', {
                            msg: 'LinkedIn account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            linkedin: profile.id
        }, function (err, existingUser) {
            if (existingUser) { return done(null, existingUser); }
            console.log(profile._json);
            // User.findOne({ email: profile._json.emailAddress }, function(err, existingEmailUser) {
            //   if (existingEmailUser) {
            //     req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
            //     done(err);
            //   } else {
            var user = new User();
            user.linkedin = profile.id;
            user.tokens.push({
                kind: 'linkedin',
                accessToken: accessToken
            });
            user.email = user.email || profile.id + '@example.com';
            user.profile.name = profile.displayName;
            user.profile.location = profile._json.location.name;
            user.profile.picture = profile._json.pictureUrl;
            user.profile.website = profile._json.publicProfileUrl;
            user.save(function (err) {
                done(err, user);
            });
            //   }
            // });
        });
    }
}));

// Login Required middleware.

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
};

// Authorization Required middleware.

exports.isAuthorized = function (req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];

    if (_.findWhere(req.user.tokens, {
        kind: provider
    })) {
        next();
    } else {
        res.redirect('/auth/' + provider);
    }
};

// User authorization routing middleware

exports.user = {
    isAuthorized: function (req, res, next) {
        console.log(req.profile);
        console.log(req.user);
        if (req.profile.id !== req.user.id) {
            req.flash('errors', {
                msg: 'You are not authorized'
            });
            return res.redirect('/account/' + req.user.id);
        }
        next();
    }
};
// Articles authorization routing middleware

exports.article = {
    isAuthorized: function (req, res, next) {
        if (req.user.id !== req.article.user.id) {
            req.flash('errors', {
                msg: 'You are not authorized'
            });
            return res.redirect('/articles/' + req.article.id);
        }
        next();
    }
};

// Comment authorization routing middleware

exports.comment = {
    isAuthorized: function (req, res, next) {
        // if the current user is comment owner or article owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
            next();
        } else {
            req.flash('errors', {
                msg: 'You are not authorized'
            });
            res.redirect('/articles/' + req.article.id);
        }
    }
};
