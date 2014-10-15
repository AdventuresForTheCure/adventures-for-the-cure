var mongoose = require('mongoose');
var inventoryItemModel = require('../models/InventoryItem');
var user = require('../models/User');

module.exports = function(config) {
  mongoose.set('debug', config.db.debugMode);
  console.log('connecting to "' + config.env + '" mongo instance');
  mongoose.connect(config.db.url);
  console.log('connected...');

  var db = mongoose.connection;
  db.on('error',
    function(err) {
      console.error('connection error: %s', err);
    }
  );
  db.once('open', function callback() {
    console.log('adventuresforthecure db opened');
  });


  // create default mongoose entries
//  userModel.createDefaultUsers();
  //inventoryItemModel.createDefaultInventoryItems();
};