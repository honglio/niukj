var express       = require("express"),
    // https       = require("https"),
    // http        = require("http"),
    passport    = require("passport"),
    fs          = require("fs");

// var options = {
//   key: fs.readFileSync(__dirname + '/config/agent-key.pem'),
//   cert: fs.readFileSync(__dirname + '/config/agent-cert.pem')
// }

var app         = express();

// Import accounts to models
var models_path = __dirname + '/server/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (file[0] === '.') { return; }
    if (file.indexOf('.js') !== -1) { require(models_path + '/' + file); }
});

// express settings
require('./config/express')(app, passport);

// Import routes
require('./config/routes')(app, passport);

app.listen(8000);
console.log("Relax is listening to port 8000.");

// expose app
exports = module.exports = app;