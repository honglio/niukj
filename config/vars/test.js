// test settings
var path = require('path');

module.exports = {
    env: 'test',
    app: {
        name: 'PresentBook'
    },
    server: {
        port: 3000,
        hostname: 'localhost',
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    db: process.env.MONGODB || 'mongodb://localhost/niukj',
    root: path.normalize(__dirname + '/../..'),
    sessionSecret: process.env.SESSION_SECRET || 'PresentBook',
    // apiurl: 'http://127.0.0.1:9698/',
    // Copy in your particulars and rename this to mail.js

    whitelist: [
        '/login',
        '/account/uploadProfileImg',
        '/articles/uploadImg',
        '/articles/uploadCoverImg'
    ],
    mail: {
        service: "user_log",
        host: "smtp.mxhichina.com",
        port: 25,
        secureConnection: false,
        name: "presentbook.cn",
        auth: {
            user: "info@presentbook.cn",
            pass: "YFLasdfama3"
        },
        ignoreTLS: false,
        debug: true,
        maxConnections: 5 // Default is 5
    },
    logmail: {
        service: "error_log",
        host: "smtp.mxhichina.com",
        port: 25,
        secureConnection: false,
        name: "presentbook.cn",
        auth: {
            user: "log@presentbook.cn",
            pass: "YFLasdfama3"
        },
        ignoreTLS: false,
        debug: true,
        maxConnections: 5 // Default is 5
    },
    oss: {
        accessKeyId: '3wXgudE0HBMAsuvb',
        accessKeySecret: '8Fl01JVf9L60DDWxighJq8dl4PeAPj',
        host: 'oss-cn-qingdao.aliyuncs.com',
        bucket: {
            profile: 'niukj-profile',
            component: 'niukj-component'
        }
    },
    weibo: {
        clientID: "1323751576",
        clientSecret: "b12169b7552b82d02f40e8eb3fbafd36",
        callbackURL: "http://www.presentbook.cn/auth/weibo/callback",
        passReqToCallback: true
    },
    renren: {
        clientID: "6a95c4020780431385f3cfcbf57d83a7",
        clientSecret: "ac5397f0b5fb4066ae50efebcc84871b",
        callbackURL: "http://www.presentbook.cn/auth/renren/callback",
        passReqToCallback: true
    },
    qq: {
        clientID: "101258472",
        clientSecret: "1270b2dc11ca15639f5adfe37bdc4ec9",
        callbackURL: "http://www.presentbook.cn/auth/qq/callback",
        passReqToCallback: true
    },
    linkedin: {
        clientID: "756t1t3x5kxidt",
        clientSecret: "Lu6nDOrcS6iw4lhG",
        callbackURL: "http://www.presentbook.cn/auth/linkedin/callback",
        passReqToCallback: true
    }
};
