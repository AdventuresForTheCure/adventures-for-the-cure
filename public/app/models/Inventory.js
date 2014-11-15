angular.module('app').factory('InventoryItem', ['$resource', InventoryItem]);
function InventoryItem($resource) {
  var inventoryItem = $resource('/api/inventoryItems', {}, {});
  return inventoryItem;
}