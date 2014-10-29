var express = require('express'),
    mongoose = require('mongoose'),
    flash = require('express-flash'),
    winston = require('winston'),
    expressValidator = require('express-validator'),
    errorHandler = require('errorhandler'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    multer = require('multer'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')({session: session}),
    csrf = require('lusca').csrf(),
    helpers = require('view-helpers'),
    config = require('./config'),
    whitelist = ['/url1', '/url2'];

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {
    // set backend views path, template engine and default layout
    app.set('views', config.root + '/server/views');
    app.set('view engine', 'jade');

    // should be placed before express.static
    app.use(compression({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    if(process.env.NODE_ENV === 'development') {
        app.use(favicon(config.root + '/public/img/ico/favicon.ico'));
        app.use(express.static(config.root + '/public'));
    } else {
        app.use(favicon(config.root + '/built/img/ico/favicon.ico'));
        app.use(express.static(config.root + '/built'));
    }

    app.use(multer());

    // Handling Uncaught Exceptions
    winston.add(winston.transports.File, {
        filename: 'log/all-logs.txt',
        handleExceptions: true
    });

    var log = {
        stream: {
            write: function (message) {
                winston.info(message);
            }
        }
    };

    app.use(logger(log));

    // cookieParser should be above session
    app.use(cookieParser());
    // bodyParser should be above methodOverride
    // app.use(express.bodyParser());
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));
    app.use(expressValidator());
    app.use(methodOverride(function (req) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    // express/mongo session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new mongoStore({
            url: config.db,
            auto_reconnect: true
        })
    }));
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    // connect flash for flash messages - should be declared after sessions
    app.use(flash());
    // should be declared after session and flash
    app.use(helpers('Niukj'));
    // adds CSRF attack protect
    app.use(function (req, res, next) {
        if (whitelist.indexOf(req.path) !== -1) {
            next();
        } else {
            csrf(req, res, next);
        }
    });
    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });
    // Keep track of previous URL to redirect back to
    // original destination after a successful login.
    app.use(function (req, res, next) {
        if (req.method !== 'GET') { return next(); }
        var path = req.path.split('/')[1];
        if ((/(auth|login|logout|signup)$/i).test(path)) { return next(); }
        req.session.returnTo = req.path;
        next();
    });

    // routes should be at the last
    // app.use(app.router); ! deprecated

    /**
     * 500 Error Handler.
     * As of Express 4.0 it must be placed at the end, after all routes.
     */

    app.use(errorHandler());

    // Nginx support
    app.enable('trust proxy');
};

// Connect to mongodb
var connect = function () {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect(config.db, options);
};
connect();
// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err);
});
// Reconnect when closed
mongoose.connection.on('disconnected', function () {
    connect();
});
