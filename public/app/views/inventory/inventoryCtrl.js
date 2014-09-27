angular.module('app').controller('inventoryCtrl', inventoryCtrl);
inventoryCtrl.$inject = ['$scope', 'inventoryService'];
function inventoryCtrl($scope, inventoryService) {
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
}

