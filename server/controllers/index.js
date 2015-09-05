exports.notfound = function(req, res) {
    if ((/json|txt|js|css|gif|png|jpg|jpeg|ico/).test(req.url)) {
        res.status(404).end();
    } else {
        res.statusCode = 404;
        res.render('404', {
            title: '网页无法访问'
        });
    }
};

/**
 * GET /
 * Home page.
 */

exports.home = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(req.session.returnTo || '/account');
    }
    res.render('home', {
        title: '首页'
    });
};

/**
 * GET /login
 * Login page.
 */
exports.login = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(req.session.returnTo || '/account');
    }
    res.render('account/login', {
        title: '登录'
    });
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
    req.logout();
    req.session.destroy(); // For Redis, Deletes the session in the database.
    // req.session = null // Deletes the cookie.
    res.redirect('/login');
};

/**
 * GET /signup
 * Signup page.
 */

exports.signup = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(req.session.returnTo || '/account');
    }
    res.render('account/signup', {
        title: '注册'
    });
};

/**
 * GET /forgot
 * Forgot Password page.
 */

exports.forgot = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: '忘记密码'
    });
};

/**
 * GET /api
 * List of API examples.
 */

exports.api = function(req, res) {
    res.render('api/index', {
        title: 'API Examples'
    });
};
