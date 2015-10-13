angular.module('app').controller('inventoryCtrl', inventoryCtrl);
inventoryCtrl.$inject = ['$scope', 'inventoryService', 'notifierService', 'identityService', 'confirmModalService'];
function inventoryCtrl($scope, inventoryService, notifierService, identityService, confirmModalService) {
  $scope.inventoryItems = {};

  $scope.getInventoryItems = function() {
//    inventoryService.getInventoryItems().then(function(data) {
//      $scope.inventoryItems = {};
//      for (var i = 0; i < data.Items.length; i++) {
//        var item = data.Items[i];
//        if (item.SalesDetails.UnitPrice && item.SalesDetails.UnitPrice > 0) {
//          if (angular.isUndefined($scope.inventoryItems[item.description])) {
//            $scope.inventoryItems[item.description] = [];
//          }
//          $scope.inventoryItems[item.description].push({
//            name: item.Description,
//            price: item.SalesDetails.UnitPrice,
//            //          quantity: item.SalesDetails.Quantity
//            quantity: 2
//          });
//        }
//      }
//    }, function(reason) {
//      notifierService.error(reason);
//    });
    inventoryService.getInventoryItems().then(function(inventoryItems) {
      $scope.inventoryItems = {};
      for (var i = 0; i < inventoryItems.length; i++) {
        var inventoryItem = inventoryItems[i];
        if (angular.isUndefined($scope.inventoryItems[inventoryItem.category])) {
          $scope.inventoryItems[inventoryItem.category] = [];
        }
        $scope.inventoryItems[inventoryItem.category].push(inventoryItem);
        inventoryItem.inEditMode = false;
      }
    }, function(reason) {
      notifierService.error(reason);
    });
  };

  $scope.getInventoryItems();
}

