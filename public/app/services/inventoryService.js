angular.module('app').factory('inventoryService', inventoryService);
inventoryService.$inject = ['Inventory'];
function inventoryService(Inventory) {
  return {
    getInventoryItems: function() {
      return Inventory.query().$promise;
    }
  };
}