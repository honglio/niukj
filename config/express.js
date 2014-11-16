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
    nodemailer = require("nodemailer"),
    session = require('express-session'),
    mongoStore = require('connect-mongo')({
        session: session
    }),
    csrf = require('lusca').csrf(),
    exec = require('child_process').exec,
    join = require('path').join,
    util = require('util'),
    helpers = require('view-helpers'),
    config = require('./config'),
    smtpTransport = nodemailer.createTransport('SMTP', config.logmail),
    whitelist = ['/url1', '/url2'],
    logDir = join(config.root, '/logs/');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * timestamp formatter
 * @returns {string}
 */

function timestamp() {
  return new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\./, ',')
    .replace(/Z/, '');
}

// make logs dir
exec('mkdir ' + logDir);
// winston configuration
winston.remove(winston.transports.Console);
winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

/**
 * default loggers
 */
winston.add(winston.transports.Console, {
  name: 'console-default',
  level: 'debug',
  colorize: true,
  timestamp: timestamp,
  handleExceptions: true // Handling Uncaught Exceptions
});
winston.add(winston.transports.File, {
  name: 'file-default',
  filename: join(logDir, 'server.log'),
  level: 'debug',
  timestamp: timestamp
});

/**
 * MailLogger
 * @type {MailLogger}
 */
function MailLogger(options) {
  if (!(this instanceof MailLogger)) {
    return new MailLogger(options);
  }
  options = options || {};
  this.name = 'mail';
  this.level = options.level || 'info';
}
util.inherits(MailLogger, winston.Transport);
MailLogger.prototype.log = function(level, msg, meta, done) {
  smtpTransport.sendMail({
    from: 'winston@niukj.com',
    to: 'dev@niukj.com',
    subject: 'Niukj: ' + level.toUpperCase(),
    tags: 'logging,' + level,
    text: msg + '\n' + util.inspect(meta)
  }, done);
};
MailLogger.prototype.logException = function(msg, meta, done) {
  this.log('error', msg, meta, done);
};

/**
 * Error loggers
 */
 winston.add(winston.transports.File, {
  name: 'file-error',
  filename: join(logDir, 'error.log'),
  level: 'warn',
  handleExceptions: true,
  timestamp: timestamp
});
winston.add(MailLogger, {
  level: 'error',
  timestamp: timestamp,
  handleExceptions: true
});

module.exports = function(app, passport) {
    // should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.set('view engine', 'jade');
    // set backend views path, template engine and default layout
    if (process.env.NODE_ENV === 'development') {
        app.set('views', join(config.root, '/server/views'));
        app.use(express.static(join(config.root, '/public')));
        app.use(favicon(join(config.root, '/public/img/ico/favicon.ico')));
    } else {
        app.set('views', join(config.root, '/built/server/views'));
        app.use(express.static(join(config.root, '/built')));
        app.use(favicon(join(config.root, '/built/img/ico/favicon.ico')));
    }

    app.use(multer());

    var log = {
        stream: {
            write: function(message) {
                if(message.indexOf(400) !== -1 || message.indexOf(404) !== -1 ||
                    message.indexOf(405) !== -1) {
                    winston.warn(message);
                } else if(message.indexOf(500) !== -1 || message.indexOf(503) !== -1 ||
                    message.indexOf(504) !== -1 || message.indexOf(501) !== -1) {
                    winston.error(message);
                } else {
                    winston.info(message);
                }
            }
        }
    };

    app.use(logger('combined', log));

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
    app.use(methodOverride(function(req) {
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
    app.use(function(req, res, next) {
        if (whitelist.indexOf(req.path) !== -1) {
            next();
        } else {
            csrf(req, res, next);
        }
    });
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
    // Keep track of previous URL to redirect back to
    // original destination after a successful login.
    app.use(function(req, res, next) {
        if (req.method !== 'GET') {
            return next();
        }
        var path = req.path.split('/')[1];
        if ((/(auth|login|logout|signup)$/i).test(path)) {
            return next();
        }
        req.session.returnTo = req.path;
        next();
    });

    // routes should be at the last
    // app.use(app.router); ! deprecated

    /**
     * 500 Error Handler.
     * As of Express 4.0 it must be placed at the end, after all routes.
     * This middleware is only intended to be used in a development environment,
     * as the full error stack traces will be sent back to the client when an error occurs.
     */
    if (process.env.NODE_ENV === 'development') {
        app.use(errorHandler());
    }
    // Nginx support
    app.enable('trust proxy');
};

// Connect to mongodb
var connect = function() {
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
mongoose.connection.on('error', function(err) {
    console.log(err);
});
// Reconnect when closed
mongoose.connection.on('disconnected', function() {
    connect();
});
