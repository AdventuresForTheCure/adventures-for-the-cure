var mongoose = require('mongoose');
var inventoryItem = require('../models/InventoryItem');
var member = require('../models/Member');
var volunteerEvents = require('../models/VolunteerEvents');

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
  member.createDefaultMembers();
  inventoryItem.createDefaultInventoryItems();
  volunteerEvents.createDefaultVolunteerEvents();
};