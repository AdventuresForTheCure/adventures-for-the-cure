angular.module('app').factory('inventoryService', ['Inventory', inventoryService]);
function inventoryService(Inventory) {
  return {
    getInventoryItems: function() {
      return Inventory.query().$promise;
    }
  };
}