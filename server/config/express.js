var crypto = require('crypto');
var express = require('express');
var helmet = require('helmet');
var logger = require('morgan');
var cookieSession = require('cookie-session');

module.exports = function(app, config) {
  app.disable('x-powered-by');
  if (config.env === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(helmet({contentSecurityPolicy: false}));
  app.use(logger(config.env === 'production' ? 'combined' : 'dev'));
  app.use(express.json({limit: '1mb'}));
  app.use(express.urlencoded({extended: false, limit: '1mb'}));
  app.use(cookieSession({
    name: 'afc.session',
    keys: [config.sessionSecret || crypto.randomBytes(32).toString('hex')],
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }));

  var builtIndex = require('path').join(config.distPath, 'index.html');
  if (require('fs').existsSync(builtIndex)) {
    app.use(express.static(config.distPath, {index: false, fallthrough: true}));
  }
  app.use(express.static(config.publicPath, {fallthrough: true}));
};
