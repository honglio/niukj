// production settings
var path = require('path');

module.exports = {
    env: 'production',
    app: {
        name: 'Niukj'
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
    sessionSecret: process.env.SESSION_SECRET || 'Niukj',
    apiurl: 'http://127.0.0.1:9698/',
    // Copy in your particulars and rename this to mail.js

    whitelist: ['/account/uploadProfileImg', '/articles/uploadImg'],
    mail: {
        service: "user_log",
        host: "smtp.mxhichina.com",
        port: 25,
        secureConnection: false,
        name: "niukj.com",
        auth: {
            user: "info@niukj.com",
            pass: "asdf7890"
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
        name: "niukj.com",
        auth: {
            user: "winston@niukj.com",
            pass: "YFLasdfama3"
        },
        ignoreTLS: false,
        debug: true,
        maxConnections: 5 // Default is 5
    },
    oss: {
        accessKeyId: '3wXgudE0HBMAsuvb',
        accessKeySecret: '8Fl01JVf9L60DDWxighJq8dl4PeAPj',
        host: 'oss-cn-beijing.aliyuncs.com',
        bucket: 'test-niukj'
    },
    weibo: {
        clientID: "1876751546",
        clientSecret: "620aab5cbf338f43a24034d28b7c32eb",
        callbackURL: "http://www.niukj.com/auth/weibo/callback",
        passReqToCallback: true
    },
    renren: {
        clientID: "ba40c5205da348c18222238f8f93bc0f",
        clientSecret: "5095fd1142cd432a9c0da9b1e87eee70",
        callbackURL: "http://www.niukj.com/auth/renren/callback",
        passReqToCallback: true
    },
    qq: {
        clientID: "101101356",
        clientSecret: "6a1622fbe03ae484f4895394afdb5c28",
        callbackURL: "http://www.niukj.com/auth/qq/callback",
        passReqToCallback: true
    },
    linkedin: {
        clientID: "75d51iuwfnv5g9",
        clientSecret: "xlvBqhYm4lKLjNNb",
        callbackURL: "http://www.niukj.com/auth/linkedin/callback",
        passReqToCallback: true
    }
};
