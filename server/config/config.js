/**
 * Configure the application.
 *
 * You can set additional heroku environmental variables like this:
 *   $ heroku config:set GITHUB_USERNAME=joesmith
 *   Adding config vars and restarting myapp... done, v12
 *   GITHUB_USERNAME: joesmith
 *
 *   $ heroku config
 *   GITHUB_USERNAME: joesmith
 *   OTHER_VAR:       production
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var sponsorLogosPath = rootPath + 'public/img/sponsors/2016/highres/';
var sponsorLogosUrl = 'img/sponsors/2016/highres/';
var jerseyImagesPath = rootPath + 'public/img/jerseys/2016';
var jerseyImagesUrl = 'img/jerseys/2016';
var campaignsPath = rootPath + 'public/app/views/campaigns/campaigns/';
var membersPath = rootPath + 'public/app/views/members/members/';
var videosPath = rootPath + '/public/app/views/results/videos/';
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var fs = require('fs');

var privateKey  = fs.readFileSync(rootPath + 'resources/certs/server.key', 'utf8');
var certificate = fs.readFileSync(rootPath + 'resources/certs/server.crt', 'utf8');

var environments = {
  /**
   * Development configuration
   */
  development: {
    env: env,
    db: {
      url: 'mongodb://localhost:27017/adventuresforthecure',
      debugMode: true
    },
    credentials: {
      key: privateKey,
      cert: certificate
    },
    rootPath: rootPath,
    sponsorLogosPath: sponsorLogosPath,
    sponsorLogosUrl: sponsorLogosUrl,
    campaignsPath: campaignsPath,
    membersPath: membersPath,
    videosPath: videosPath,
    jerseyImagesPath: jerseyImagesPath,
    jerseyImagesUrl: jerseyImagesUrl,
    port: process.env.PORT || 3030,
    sslport: process.env.SSLPORT || 3031,
    emailer: {
      password: process.env.AFC_EMAIL_PASSWORD
    }
  },
  /**
   * Production configuration
   */
  production: {
    env: env,
    db: {
      url: 'mongodb://' + process.env.AFC_MONGO_USERNAME + ':' + process.env.AFC_MONGO_PASSWORD + '@ds053597.mongolab.com:53597/adventuresforthecure',
      debugMode: false
    },
    credentials: {
      key: privateKey,
      cert: certificate
    },
    rootPath: rootPath,
    sponsorLogosPath: sponsorLogosPath,
    sponsorLogosUrl: sponsorLogosUrl,
    campaignsPath: campaignsPath,
    membersPath: membersPath,
    videosPath: videosPath,
    jerseyImagesPath: jerseyImagesPath,
    jerseyImagesUrl: jerseyImagesUrl,
    port: process.env.PORT || 80,
    sslport: process.env.SSLPORT || 443,
    emailer: {
      password: process.env.AFC_EMAIL_PASSWORD
    }
  }
};

module.exports = environments[env];