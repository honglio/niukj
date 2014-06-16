exports.notfound = function(req, res) {
  res.render('404', {
    title: '网页无法访问'
  });
};

/**
 * GET /
 * Home page.
 */

exports.home = function(req, res) {
  res.render('home', {
    title: '首页'
  });
};

/**
 * GET /login
 * Login page.
 */
exports.login = function(req, res) {
  if (req.user) return res.redirect('/');
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
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */

exports.signup = function(req, res) {
  if (req.user) return res.redirect('/');
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
 * GET /account
 * Profile page.
 */

exports.account = function(req, res) {
  res.render('account/profile', {
    title: '账户管理'
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

/**
 * GET /contact
 * Contact form page.
 */

exports.contactForm = function(req, res) {
  res.render('contactForm', {
    title: '客户服务'
  });
};