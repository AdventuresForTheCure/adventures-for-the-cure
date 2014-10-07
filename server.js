var express = require('express');
var userModel = require('../models/User');
var inventoryItemModel = require('../models/InventoryItem');

var app = express();

var config = require('./server/config/config');

console.log('configuring express');
require('./server/config/express')(app, config);

console.log('configuring mongoose');
require('./server/config/mongoose')(config);

console.log('configuring passport');
require('./server/config/passport')();

console.log('configuring routes');
require('./server/config/routes')(app, config);

// create default mongoose entries
userModel.createDefaultUsers();
//inventoryItemModel.createDefaultInventoryItems();

console.log('configuring listener');
app.listen(config.port);
console.log("Listening on port " + config.port + "...");