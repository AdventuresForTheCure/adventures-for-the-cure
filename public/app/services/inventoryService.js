angular.module('app').factory('inventoryService', function(Inventory) {
  return {
    getInventoryItems: function() {
      return Inventory.query().$promise;
    }
  };
})