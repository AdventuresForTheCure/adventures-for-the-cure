var InventoryItem = require('mongoose').model('InventoryItem')
  errorHandler = require('../utilities/errorHandler');

exports.getInventoryItems = function (req, res) {
  InventoryItem.find({}).exec(function (err, collection) {
    res.send(collection);
  });
};