var path = require('path');
var crypto = require('crypto');
require('dotenv').config({path: path.resolve(__dirname, '../..', '.env')});

var rootPath = path.resolve(__dirname, '../..');
var env = process.env.NODE_ENV || 'development';
var sessionSecret = process.env.AFC_SESSION_SECRET;

if (env === 'production' && !sessionSecret) {
  throw new Error('AFC_SESSION_SECRET must be configured in production');
}

module.exports = {
  env: env,
  rootPath: rootPath,
  publicPath: path.join(rootPath, 'public'),
  distPath: path.join(rootPath, 'dist'),
  appPath: path.join(rootPath, 'dist', 'index.html'),
  campaignsPath: path.join(rootPath, 'public/app/views/campaigns/campaigns'),
  port: Number(process.env.PORT || 3030),
  sessionSecret: sessionSecret || crypto.randomBytes(32).toString('hex')
};
