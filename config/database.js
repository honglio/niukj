var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
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

};
