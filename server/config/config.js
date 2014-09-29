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
var campaignsPath = rootPath + 'public/app/views/campaigns/campaigns/';
var membersPath = rootPath + 'public/app/views/members/members/';
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var environments = {
  development: {
    env: env,
    db: {
      url: 'mongodb://localhost:27017/adventuresforthecure',
        debugMode: true
    },
    rootPath: rootPath,
    campaignsPath: campaignsPath,
    membersPath: membersPath,
    port: process.env.PORT || 3030
  }, production: {
    env: env,
    db: {
      url: 'mongodb://' + process.env.AFC_MONGO_USERNAME + ':' + process.env.AFC_MONGO_PASSWORD + '@ds037688.mongolab.com:37688/adventuresforthecure',
        debugMode: false
    },
    rootPath: rootPath,
    campaignsPath: campaignsPath,
    membersPath: membersPath,
    port: process.env.PORT || 80
  }
}

module.exports = environments[env];