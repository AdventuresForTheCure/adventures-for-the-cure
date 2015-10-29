var Xero = require('../utilities/xero');

var CONSUMER_KEY = process.env.XERO_CONSUMER_KEY;
var CONSUMER_SECRET = process.env.XERO_CONSUMER_SECRET;

exports.getInventoryItems = function(req, res) {
  var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET);
  xero.call('GET', 'Items', undefined, function (error, data, response) {
    if (error) {
      console.error(error);
      return res.send(400, {error: 'Unable to contact Xero'});
    } else {
      data = JSON.parse(data).Items;
      var items = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.IsTrackedAsInventory && item.QuantityOnHand > 0) {
          console.log('raw item', item);
          items.push({
            itemId: item.ItemID,
            code: item.Code,
            name: item.Name,
            category: item.Name.split(' - ')[0],
            price: item.SalesDetails.UnitPrice,
            quantity: item.QuantityOnHand
          });
        }
      }
      return res.send(200, items);
    }
  });
}