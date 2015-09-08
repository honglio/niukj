var _ = require('underscore'),
    express = require('express'),
    flash = require('express-flash'),
    raven = require('raven'),
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
    // redisStore = require( 'connect-redis' )( session ),
    csrf = require('lusca').csrf(),
    // csrf = require( 'lusca' ).csrf({header:'x-xsrf-token'}),
    exec = require('child_process').exec,
    join = require('path').join,
    util = require('util'),
    helpers = require('view-helpers'),
    config = require('./config'),
    smtpTransport = nodemailer.createTransport('SMTP', config.logmail),
    logDir = join(config.root, '/logs/');

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
        subject: 'Niukj: ' + config.env + ' Server Error ' + level.toUpperCase(),
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

if (config.logmail) {
    winston.add(MailLogger, {
        level: 'error',
        timestamp: timestamp,
        handleExceptions: true
    });
}

module.exports = function(app, passport) {
    // set the template engine to .jade files
    app.set('view engine', 'jade');

    // should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    app.use(compression({
        // filter: function(req, res) {
        //     return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        // },
        level: 9
    }));

    // set backend views path and default layout
    if (config.env === 'production') {
        app.set('views', join(config.root, '/built/server/views'));
        app.use(express.static(join(config.root, '/built'), {
            maxAge: 30 * 1000 * 60 * 60 * 24
        }));
        app.use(express.static(join(config.root, '/uploads')));
        app.use(favicon(join(config.root, '/built/img/ico/favicon.ico')));
    } else {
        app.set('views', join(config.root, '/server/views'));
        app.use(express.static(join(config.root, '/public')));
        app.use(express.static(join(config.root, '/uploads')));
        app.use(favicon(join(config.root, '/public/img/ico/favicon.ico')));
    }

    app.use(multer({
        dest: join(config.root, '/uploads/')
    }));

    var log = {
        stream: {
            write: function(message) {
                if (message.indexOf(' 400 ') !== -1 || message.indexOf(' 404 ') !== -1 ||
                    message.indexOf(' 405 ') !== -1) {
                    winston.warn(message);
                } else if (message.indexOf(' 500 ') !== -1 || message.indexOf(' 503 ') !== -1 ||
                    message.indexOf(' 504 ') !== -1 || message.indexOf(' 501 ') !== -1) {
                    winston.error(message);
                } else {
                    winston.info(message);
                }
            }
        },
        // skip: function (req, res) { return res.statusCode < 400; }
    };

    // Add custom variables to log
    logger.token('userId', function getSession(req) {
        var userId;
        if (req.session !== undefined && !_.isEmpty(req.session.passport)) {
            userId = req.session.passport.user.id;
        }
        return 'userId: ' + userId;
    });
    logger.token('returnTo', function getSession(req) {
        var returnTo = req.session === undefined ? '' : req.session.returnTo;
        return 'returnTo: ' + returnTo;
    });

    var format = ':remote-addr - :remote-user [:date[clf]] ' +
        '":method :url HTTP/:http-version" :status ' +
        ':res[content-length] ":referrer" ":user-agent" ' +
        '":userId" ":returnTo"';
    // combined log format
    app.use(logger(format, log));

    // cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.json({
        limit: '20mb'
    }));
    app.use(bodyParser.raw({
        limit: '20mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '20mb',
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
    // express/redis session storage
    // app.use( session( {
    //     saveUninitialized: false,
    //     resave: false,
    //     secret: config.sessionSecret,
    //     store: new redisStore( config.redis )
    // } ) );

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    // connect flash for flash messages - should be declared after sessions
    app.use(flash());
    // should be declared after session and flash
    app.use(helpers('Niukj'));
    // adds CSRF attack protect
    app.use(function(req, res, next) {
        if (config.whitelist.indexOf(req.path) !== -1) {
            next();
        } else {
            csrf(req, res, next);
        }
    });
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
    // set angular csrf token
    // app.use( function( req, res, next ) {
    //     res.cookie( '_csrf', res.locals ? res.locals[ '_csrf' ] : '' );
    //     next();
    // } );
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
        req.session.returnTo = req.header('referrer') || req.session.returnTo;
        next();
    });

    // routes should be at the last
    // app.use(app.router); ! deprecated

    // detect and redirect all desktop access to root path.
    // if ( config.env !== 'develop' ) {
    //     app.use( function( req, res, next ) {
    //         var ua = req.header( 'user-agent' );
    //         if ( !( /mobile/i.test( ua ) ) && req.path !== '/' ) {
    //             req.session.returnTo = req.path;
    //             return res.redirect( 302, '/' );
    //         }
    //         next();
    //     } );
    // }

    /**
     * 500 Error Handler.
     * As of Express 4.0 it must be placed at the end, after all routes.
     * This middleware is only intended to be used in a development environment,
     * as the full error stack traces will be sent back to the client when an error occurs.
     */
    if (process.env.NODE_ENV === 'develop') {
        app.use(errorHandler());
    } else {
        app.use(raven.middleware.express('https://56176c36c15846c58137bbd2e7f4bd30:34178d8cd6734be69f351171908ce581@app.getsentry.com/43942'));
    }
    // Nginx support
    app.enable('trust proxy');
};
