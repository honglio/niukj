// production settings
var path = require('path');

module.exports = {
    env: 'production',
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
        '/account/uploadProfileImg',
        '/articles/uploadImg',
        '/articles/uploadCoverImg'
    ],
};
