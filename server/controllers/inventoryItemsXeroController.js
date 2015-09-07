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
      console.log(data);
      return res.send(200, data);
    }
  });
}