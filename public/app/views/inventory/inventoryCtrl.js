angular.module('app').controller('inventoryCtrl', inventoryCtrl);
inventoryCtrl.$inject = ['$scope', 'inventoryService', 'notifierService', 'identityService'];
function inventoryCtrl($scope, inventoryService, notifierService, identityService) {
  $scope.inventoryItems = {};
  $scope.newItem = newItem();
  $scope.allCategories = [
    'DeFeet Socks',
    'Hats',
    'Hincapie Merchandise - 2011',
    'Hincapie Merchandise - 2012',
    'Hincapie Merchandise - 2013',
    'Hincapie Merchandise - 2014',
    'Hincapie Merchandise - 2015',
    'Movies',
    'Saucony Running Gear',
    'Water Bottles',
    'Winged Foot T-shirts and Sweats'
  ];

  $scope.getInventoryItems = function() {
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

  $scope.ableToEdit = function() {
    if (identityService.currentMember && identityService.currentMember.isInventory()) {
      return true;
    } else {
      return false;
    }
  }

  $scope.inEditMode = function(inventoryItem) {
    if (identityService.currentMember && identityService.currentMember.isInventory() && inventoryItem.inEditMode) {
      return true;
    } else {
      return false;
    }
  };

  $scope.toggleEditMode = function(inventoryItem, index) {
    inventoryItem.inEditMode = !inventoryItem.inEditMode;
    if (inventoryItem.inEditMode) {
      inventoryItem.master = angular.copy(inventoryItem);
    } else {
      $scope.inventoryItems[inventoryItem.category][index] = angular.copy(inventoryItem.master);
      $scope.inventoryItems[inventoryItem.category][index].inEditMode = false;
      $scope.inventoryItems[inventoryItem.category][index].master = undefined;
      delete $scope.inventoryItems[inventoryItem.category][index].master;
    }
  };

  $scope.update = function(inventoryItem) {
    inventoryItem.inEditMode = false;
    inventoryService.save(inventoryItem).then(function(item) {
      notifierService.notify('Inventory item was update');
    }, function(reason) {
      notifierService.error(reason);
    });
  };

  $scope.createItem = function() {
    inventoryService.save($scope.newItem).then(function(item) {
      notifierService.notify('New item was created');
      $scope.getInventoryItems();
    }, function(reason) {
      notifierService.error(reason);
    });
  };

  $scope.resetForm = function() {
    $scope.newItem = newItem();
  };

  $scope.delete = function(inventoryItem) {
    inventoryService.delete(inventoryItem).then(function(item) {
      $scope.getInventoryItems();
      notifierService.notify('Inventory item was deleted');
    }, function(reason) {
      notifierService.error(reason);
    });
  };

  $scope.onFileSelect = function($files) {
    $scope.newItem.img = $files[0];
  };

  $scope.onUpdatedFileSelect = function(inventoryItem, $files) {
    inventoryItem.img = $files[0];
    inventoryItem.loadingImg = true;
    inventoryService.saveImg(inventoryItem).then(function(updatedInventoryItem) {
      inventoryItem.loadingImg = false;
      inventoryItem.imgPath = updatedInventoryItem.imgPath;
      inventoryItem.img = $files[0];
    }, function(reason) {
      inventoryItem.loadingImg = false;
      notifierService.error('Error uploading image, please try again...');
    });
  };

  function newItem() {
    return {
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      salePrice: undefined,
      img: undefined
    }
  };

  $scope.getInventoryItems();
}

