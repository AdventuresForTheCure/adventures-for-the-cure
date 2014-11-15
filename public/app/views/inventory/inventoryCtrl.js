angular.module('app').controller('inventoryCtrl', inventoryCtrl);
inventoryCtrl.$inject = ['$scope', 'inventoryService', 'notifierService', 'identityService'];
function inventoryCtrl($scope, inventoryService, notifierService, identityService) {
  $scope.inventoryItems = {};

  inventoryService.getInventoryItems().then(function(inventoryItems) {
    for (var i = 0; i < inventoryItems.length; i++) {
      var inventoryItem = inventoryItems[i];
      if (angular.isUndefined($scope.inventoryItems[inventoryItem.category])) {
        $scope.inventoryItems[inventoryItem.category] = [];
      }
      $scope.inventoryItems[inventoryItem.category].push(inventoryItem);
    }
  });

  $scope.ableToEdit = function() {
    if (identityService.currentUser.isInventory()) {
      return true;
    } else {
      return false;
    }
  };
}

