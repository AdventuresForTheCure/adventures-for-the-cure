var path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../..', '.env')});
var siteSeo = require('../../shared/siteSeo.json');

var rootPath = path.resolve(__dirname, '../..');
var env = process.env.NODE_ENV || 'development';

module.exports = {
  env: env,
  rootPath: rootPath,
  publicPath: path.join(rootPath, 'public'),
  distPath: path.join(rootPath, 'dist'),
  appPath: path.join(rootPath, 'dist', 'index.html'),
  serverBundlePath: path.join(rootPath, 'dist', 'server', 'entry-server.mjs'),
  siteUrl: siteSeo.siteUrl,
  campaignsPath: path.join(rootPath, 'public/app/views/campaigns/campaigns'),
  port: Number(process.env.PORT || 3030)
};
