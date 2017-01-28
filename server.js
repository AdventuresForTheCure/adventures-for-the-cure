var express = require('express');
var http = require('http');

var app = express();

var config = require('./server/config/config');

console.log('configuring cloudinary');
require('./server/config/cloudinary')();

console.log('configuring express');
require('./server/config/express')(app, config);

console.log('configuring mongoose');
require('./server/config/mongoose')(config);

console.log('configuring passport');
require('./server/config/passport')();

console.log('configuring routes');
require('./server/config/routes')(app, config);

console.log('configuring servers');
var httpServer = http.createServer(app);

httpServer.listen(config.port);
console.log('Listening on port ' + config.port + '...');