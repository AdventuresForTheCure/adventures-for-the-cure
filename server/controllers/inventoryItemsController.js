var InventoryItem = require('mongoose').model('InventoryItem');
var errorHandler = require('../utilities/errorHandler');
var cloudinaryWrapper = require('../utilities/cloudinaryWrapper');
var emailer = require('../utilities/emailer');

exports.saveInventoryItem = function(req, res, next) {
  var inventoryItemData = InventoryItem.toInventoryItemData(req.body);

  if (!req.user || !req.user.hasRole('inventory')) {
    errorHandler.sendError(req, res, err, 403);
  }

  // if there is an image then save it first
  if (req.files.img) {
    cloudinaryWrapper.saveImg(req.files.img, inventoryItemData.name, function (err, result) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      else {
        if (!result) {
          inventoryItemData.imgPath = '';
        } else {
          inventoryItemData.imgPath = result.url;
        }
        // save inventory data
        saveInventoryData(req, res, inventoryItemData);
      }
    });
  }
  // save inventory data
  else {
    saveInventoryData(req, res, inventoryItemData);
  }
};

exports.updateInventoryItem = function(req, res) {
  var inventoryItemId = req.params.id;
  var inventoryItemData = InventoryItem.toInventoryItemData(req.body);

  if(!req.user.hasRole('inventory')) {
    res.status(403);
    return res.end();
  }

  updateInventoryItem(req, res, inventoryItemId, inventoryItemData);
};

exports.getInventoryItems = function (req, res) {
  InventoryItem.find({}).exec(function (err, collection) {
    if (err) {
      errorHandler.sendError(req, res, err);
    }
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
        deleteInventoryItem(req, res, inventoryItem);
      }
    });
  }
};

exports.updateInventoryItemImg = function(req, res) {
  var inventoryItemId = req.params.id;

  if(!req.user.hasRole('inventory')) {
    res.status(403);
    return res.end();
  }

  InventoryItem.findById(inventoryItemId, function(err, inventoryItem) {
    if (!inventoryItem) { errorHandler.sendError(req, res, 'Inventory Item not found with id: ' + inventoryItemId); }
    else {
      var inventoryItemData = {};
      // if there is an img to save then
      // save the image by overwriting the old image using the inventoryItemData.imageId parameter
      if (req.files.file) {
        var imgName = inventoryItem.category + "_" + inventoryItem.name;
        cloudinaryWrapper.saveImg(req.files.file, imgName, function (err, result) {
          if (err) { errorHandler.sendError(req, res, err); }
          else {
            inventoryItemData.imgPath = result.url;
            updateInventoryItem(req, res, inventoryItemId, inventoryItemData);
          }
        });
      }
      // otherwise save the member data
      else {
        updateInventoryItem(req, res, inventoryItemId, inventoryItemData);
      }
    }
  });
};

function updateInventoryItem(req, res, inventoryItemId, inventoryItemData) {
  emailer.sendAuditMessageEMail(req.user.name + ' is updating the inventory item: ' + JSON.stringify(inventoryItemData));
  InventoryItem.findByIdAndUpdate(inventoryItemId, inventoryItemData, function(err, inventoryItem) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(inventoryItem);
  });
};

function deleteInventoryItem(req, res, inventoryItem) {
  emailer.sendAuditMessageEMail(req.user.name + ' is deleting the inventory item: ' + JSON.stringify(inventoryItem));
  inventoryItem.remove(function(err) {
    if(err) { errorHandler.sendError(req, res, err); }
    return res.end();
  });
};

function saveInventoryData(req, res, inventoryItemData) {
  emailer.sendAuditMessageEMail(req.user.name + ' is saving the inventory item: ' + JSON.stringify(inventoryItemData));
  InventoryItem.create(inventoryItemData, function (err, inventoryItem) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(inventoryItem);
  });
}