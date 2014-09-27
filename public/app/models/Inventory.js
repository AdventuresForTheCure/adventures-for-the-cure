angular.module('app').factory('Inventory', Inventory);
Inventory.$inject = ['$resource'];
function Inventory($resource) {
  var Inventory = $resource('/api/inventoryItems', {}, {});
  return Inventory;
}