angular.module('app').controller('confirmModalCtrl', confirmModalCtrl);
confirmModalCtrl.$inject = ['$scope', '$modalInstance', 'message'];
function confirmModalCtrl ($scope, $modalInstance, message) {
  $scope.message = message;
  $scope.confirm = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}