var express = require('express');
var http = require('http');
var config = require('./server/config/config');
var app = require('./server/app');
var httpServer = http.createServer(app);

httpServer.listen(config.port);
console.log('Listening on port ' + config.port + '...');
