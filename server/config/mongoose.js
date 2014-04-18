var mongoose = require('mongoose'),
  userModel = require('../models/User');

module.exports = function(env, config) {
  mongoose.set('debug', config.db.debugMode)
  console.log("connecting to '" + env + "' mongo instance");
  mongoose.connect(config.db.url)
  console.log("connected...");

  var db = mongoose.connection;
  db.on('error',
    function(err) {
      console.error('connection error: %s', err);
    }
  );
  db.once('open', function callback() {
    console.log('adventuresforthecure db opened');
  });

  userModel.createDefaultUsers();
};