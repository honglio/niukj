/**
 * Controllers
 */

var index = require('../server/controllers/index');
var accounts = require('../server/controllers/accounts');
var comments = require('../server/controllers/comments');
var articles = require('../server/controllers/articles');
var tags = require('../server/controllers/tags');
var auth = require('../server/controllers/auth');
var api = require('../server/controllers/api');
var contactForm = require('../server/controllers/contactForm');
var passportConf = require('./passport');
var crypto = require('crypto');

/*
 * Routes Example
 *
 * Name       Method    Path
 * ---------------------------------------------
 * Index      GET     /restaurants
 * Show       GET     /restaurants/:id
 * New        GET     /restaurants/new
 * Create     POST    /restaurants
 * Edit       GET     /restaurants/edit
 * Update       PUT     /restaurants/:id
 * Delete       GET     /restaurants/delete
 * Destroy      DELETE    /restaurants/:id
 * Search     GET     /restaurants/search?<query>
 * Showcodes    GET     /restaurants/:id/codes
 * Generatecodes  GET     /restaurants/:id/generate?n=<number>
 */

module.exports = function(app, passport) {

    /**
     * Web page routes.
     */
    app.get('/', index.home);
    app.get('/login', index.login);
    app.get('/logout', index.logout);
    app.get('/signup', index.signup);
    app.get('/forgot', index.forgot);
    app.get('/api', index.api);

    /**
     * Contact From routes.
     */
    app.post('/contact-form', contactForm.postContact);
    app.post('/subscribe', contactForm.subscribe);

    /**
     * Authentication routes.
     */
    app.post('/login', auth.postLogin);
    app.post('/forgot', auth.postForgot);
    app.get('/reset/:token', auth.getReset);
    app.post('/reset/:token', auth.postReset);
    app.post('/signup', auth.postSignup);

    /**
     * user account routes.
     */
    app.param('uid', accounts.load);
    app.get('/account', passportConf.isAuthenticated, articles.my);
    app.post('/account/profile', passportConf.isAuthenticated, accounts.postUpdateProfile);
    app.post('/account/password', passportConf.isAuthenticated, accounts.postUpdatePassword);
    app.post('/account/uploadProfileImg', passportConf.isAuthenticated, accounts.uploadProfileImg);
    app.get('/account/manage', passportConf.isAuthenticated, accounts.getManage);
    app.post('/account/delete', passportConf.isAuthenticated, accounts.postDeleteAccount);
    app.get('/account/unlink/:provider', passportConf.isAuthenticated, accounts.getOauthUnlink);

    app.get('/account/:uid', accounts.accountbyId);
    app.get('/account/:uid/followers', passportConf.isAuthenticated, accounts.followerbyId);
    app.get('/account/:uid/followings', passportConf.isAuthenticated, accounts.followingbyId);
    app.post('/account/:uid/contact', passportConf.isAuthenticated, accounts.addContact);
    app.delete('/account/:uid/contact', passportConf.isAuthenticated, accounts.removeContact);
    app.post('/contacts/find/:str', passportConf.isAuthenticated, accounts.findContact);

    /**
     * 3rd party account routes.
     */
    app.get('/api/weibo', passportConf.isAuthenticated, passportConf.isAuthorized, api.getWeibo);
    app.get('/api/renren', passportConf.isAuthenticated, passportConf.isAuthorized, api.getRenren);
    app.get('/api/qq', passportConf.isAuthenticated, passportConf.isAuthorized, api.getQQ);
    // app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, api.getGithub);
    app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, api.getLinkedin);

    /**
     * OAuth routes for sign-in.
     */
    app.get('/auth/weibo', passport.authenticate('weibo'));
    app.get('/auth/weibo/callback', function(req, res, next) {
        passport.authenticate('weibo', {
            failureRedirect: '/login'
        })(req, res, next);
    }, function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/renren', passport.authenticate('renren'));
    app.get('/auth/renren/callback', function(req, res, next) {
        passport.authenticate('renren', {
            failureRedirect: '/login'
        })(req, res, next);
    }, function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });

    // QQ登录认证时 `state` 为必填参数
    // 系client端的状态值，用于第三方应用防止CSRF攻击，成功授权后回调时会原样带回
    app.get('/auth/qq', function(req, res, next) {
        req.session = req.session || {};
        req.session.authState = crypto.createHash('sha1').update(-(new Date()) + '').digest('hex');
        passport.authenticate('qq', {
            state: req.session.authState,
            scope: ['get_user_info', 'list_album']
        })(req, res, next);
    });
    app.get('/auth/qq/callback', function(req, res, next) {
        // 通过比较认证返回的`state`状态值与服务器端`session`中的`state`状态值
        // 决定是否继续本次授权
        if (req.session && req.session.authState && req.session.authState === req.query.state) {
            passport.authenticate('qq', {
                failureRedirect: '/login'
            })(req, res, next);
        } else {
            return next(new Error('Auth State Mismatch'));
        }
    }, function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        state: 'Some State'
    }));
    app.get('/auth/linkedin/callback', function(req, res, next) {
        passport.authenticate('linkedin', {
            failureRedirect: '/login'
        })(req, res, next);
    }, function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });

    // article routes
    app.param('id', articles.load);
    app.get('/articles', passportConf.isAuthenticated, articles.search);
    app.get('/articles/explore', articles.explore);
    app.get('/articles/new', passportConf.isAuthenticated, articles.new);
    app.post('/articles', passportConf.isAuthenticated, articles.create);
    app.get('/articles/:id/manage', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.show);
    app.get('/articles/:id/get', passportConf.isAuthenticated, articles.getContent);
    app.get('/articles/:id/edit', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.edit);
    app.put('/articles/:id', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.update);
    app.delete('/articles/:id', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.destroy);
    app.get('/articles/:id/present', articles.present);
    app.post('/articles/:id/desc', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.desc);
    app.post('/articles/:id/draft', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.draft);
    app.post('/articles/:id/tags', passportConf.isAuthenticated, passportConf.article.isAuthorized, tags.create);
    app.get('/articles/:id/love', passportConf.isAuthenticated, articles.love);
    app.post('/articles/uploadImg', passportConf.isAuthenticated, articles.uploadImg);
    app.post('/articles/uploadCoverImg', passportConf.isAuthenticated, articles.uploadCoverImg);

    // comment routes
    app.param('commentId', comments.load);
    app.post('/articles/:id/comments', passportConf.isAuthenticated, comments.create);
    app.get('/articles/:id/comments', passportConf.isAuthenticated, comments.create);
    app.delete('/articles/:id/comments/:commentId', passportConf.isAuthenticated, passportConf.comment.isAuthorized, comments.destroy);

    // tag routes
    app.get('/tags/:tag', tags.index);

    // page not found
    app.get('*', index.notfound);
};
