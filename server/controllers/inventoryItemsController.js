var InventoryItem = require('mongoose').model('InventoryItem');
var errorHandler = require('../utilities/errorHandler');

exports.getInventoryItems = function (req, res) {
  InventoryItem.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};