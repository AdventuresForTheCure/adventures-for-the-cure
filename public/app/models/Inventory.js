angular.module('app').factory('Inventory', function($resource) {
  var Inventory = $resource('/api/inventoryItems', {}, {});
  return Inventory;
})