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
        var category = 'General';
        var imgPath = '';
        if (item.IsTrackedAsInventory && item.QuantityOnHand > 0 && item.Name.indexOf('test') < 0) {
          // add mug image
          if (item.Code === 'ESC-2018-MUG') {
            imgPath = 'img/mugs/ESC-2018-MUG-2.jpg'
          }

          // figure out category stuff
          if (item.Name.indexOf('shirt') >= 0) {
            category = 'T-Shirts'
          } else if (item.Code.indexOf('STICKER') === 0) {
            category = 'Stickers'
            if (item.Code === 'STICKER-AFC-BUMPER') {
              imgPath = 'img/stickers/AFC_white_large.JPG'
            } else if (item.Code === 'STICKER-AFCHUB-SMALL-WHITE') {
              imgPath = 'img/stickers/AFC_Hub_resize.JPG'
            } else if (item.Code === 'STICKER-AFC-SMALL-BLACK') {
              imgPath = 'img/stickers/AFC_black_small.JPG'
            } else if (item.Code === 'STICKER-AFC-SMALL-CLEAR') {
              imgPath = 'img/stickers/AFC_vinyl.JPG'
            }
          } else if (item.Name.indexOf('2012') === 0) {
            category = '2012 Kit'
          } else if (item.Name.indexOf('2013') === 0) {
            category = '2013 Kit'
          } else if (item.Name.indexOf('2014') === 0) {
            category = '2014 Kit'
          } else if (item.Name.indexOf('2015') === 0) {
            category = '2015 Kit'
          } else if (item.Name.indexOf('2018') === 0) {
            category = '2018 Kit'
          } else if (item.Name.indexOf('Hat') === 0) {
            category = 'Hats'
          } else if (item.Name.indexOf('AFC Water Bottle') === 0) {
            category = 'AFC Water Bottles'
          } else if (item.Name.indexOf('Sock') === 0) {
            category = 'Socks'
          } else if (item.Name.indexOf('Sweats') === 0) {
            category = 'Sweats'
          }
          console.log('raw item', item);
          items.push({
            itemId: item.ItemID,
            code: item.Code,
            name: item.Name,
            category: category,
            price: item.SalesDetails.UnitPrice,
            quantity: item.QuantityOnHand,
            imgPath: imgPath
          });
        }
        // TODO add the DVDs even though their quantity is 0
        else if (item.Name === 'DVD Movie - AFC Documentary') {
          items.push({
            itemId: item.ItemID,
            code: item.Code,
            name: item.Name,
            category: 'Movie',
            price: item.SalesDetails.UnitPrice,
            quantity: 100
          });
        }
      }
      return res.send(200, items);
    }
  });
}