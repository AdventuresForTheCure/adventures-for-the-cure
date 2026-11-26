var express = require('express');
var helmet = require('helmet');
var logger = require('morgan');

module.exports = function(app, config) {
  app.disable('x-powered-by');
  if (config.env === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(helmet({
    contentSecurityPolicy: false,
    referrerPolicy: {policy: 'strict-origin-when-cross-origin'}
  }));
  app.use(logger(config.env === 'production' ? 'combined' : 'dev'));
  app.use(express.json({limit: '1mb'}));
  app.use(express.urlencoded({extended: false, limit: '1mb'}));

  var builtIndex = require('path').join(config.distPath, 'index.html');
  if (require('fs').existsSync(builtIndex)) {
    app.use(express.static(config.distPath, {index: false, fallthrough: true}));
  }
  app.use(express.static(config.publicPath, {fallthrough: true}));
};
