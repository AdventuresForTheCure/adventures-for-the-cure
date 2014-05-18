var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var app = express();

var configEnv = require('./server/config/config')[env];
var rootPath = require('./server/config/config').paths.rootPath;

console.log('configuring express');
require('./server/config/express')(app, rootPath);

console.log('configuring mongoose');
require('./server/config/mongoose')(env, configEnv);

console.log('configuring passport');
require('./server/config/passport')();

console.log('configuring routes');
require('./server/config/routes')(app, rootPath);

console.log('configuring listener');
app.listen(configEnv.port);
console.log("Listening on port " + configEnv.port + "...");