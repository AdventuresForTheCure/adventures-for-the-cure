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

module.exports = {
  development: {
    db: {
      url: 'mongodb://localhost:27017/adventuresforthecure',
      debugMode: true
    },
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    db: {
      url: 'mongodb://'+process.env.AFC_MONGO_USERNAME+':'+process.env.AFC_MONGO_PASSWORD+'@ds027489.mongolab.com:27489/adventuresforthecure',
      debugMode: false
    },
    rootPath: rootPath,
    port: process.env.PORT || 80
  }
}