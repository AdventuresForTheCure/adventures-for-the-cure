angular.module('app').controller('adminCtrl', adminCtrl);
adminCtrl.$inject = ['$scope', '$location', 'notifierService', 'authorizationService'];
function adminCtrl($scope, $location, notifierService, authorizationService) {
  $scope.createUser = function () {
    var newUserData = {
      username: $scope.username,
      password: $scope.password,
      firstName: $scope.firstName,
      lastName: $scope.lastName
    };

    authorizationService.createUser(newUserData).then(function () {
      notifierService.notify('User account created!');
      $location.path('/');
    }, function (reason) {
      notifierService.error(reason);
    });
  };
}