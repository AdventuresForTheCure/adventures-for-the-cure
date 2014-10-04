angular.module('app').factory('Inventory', ['$resource', Inventory]);
function Inventory($resource) {
  var inventory = $resource('/api/inventoryItems', {}, {});
  return inventory;
}