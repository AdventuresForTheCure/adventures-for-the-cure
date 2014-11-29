var InventoryItem = require('mongoose').model('InventoryItem');
var errorHandler = require('../utilities/errorHandler');

exports.saveInventoryItem = function(req, res, next) {
  var inventoryItemData = toInventoryItemData(req.user, req.body);

  if (!req.user || !req.user.hasRole('inventory')) {
    errorHandler.sendError(req, res, err, 403);
  }

  // create the item
  InventoryItem.create(inventoryItemData, function (err, inventoryItem) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(inventoryItem);
  });
};

exports.updateInventoryItem = function(req, res) {
  var inventoryItemId = req.params.id;
  var inventoryItemData = InventoryItem.toInventoryItemData(req.body);

  if(!req.user.hasRole('inventory')) {
    res.status(403);
    return res.end();
  }

  InventoryItem.findByIdAndUpdate(inventoryItemId, inventoryItemData, function(err, inventoryItem) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(inventoryItem);
  });
};

exports.getInventoryItems = function (req, res) {
  InventoryItem.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.deleteInventoryItem = function(req, res) {
  var inventoryItemId = req.params.id;

  if(!req.user.hasRole('inventory')) {
    res.status(403);
    return res.end();
  }
  else if (!inventoryItemId) {
    res.status(400);
    return res.end();
  }
  else {
    InventoryItem.findById(inventoryItemId).exec(function(err, data) {
      if(err) { errorHandler.sendError(req, res, err, 404); }
      else {
        var inventoryItem = data;
        inventoryItem.remove(function(err) {
          if(err) { errorHandler.sendError(req, res, err); }
          return res.end();
        });
      }
    });
  }
};