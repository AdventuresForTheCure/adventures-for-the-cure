angular.module('app').controller('adminCtrl', adminCtrl);
adminCtrl.$inject = ['$scope', '$location', 'notifierService', 'authorizationService'];
function adminCtrl($scope, $location, notifierService, authorizationService) {
  $scope.createMember = function () {
    var newMemberData = {
      username: $scope.username,
      password: $scope.password,
      firstName: $scope.firstName,
      lastName: $scope.lastName
    };

    authorizationService.createMember(newMemberData).then(function () {
      notifierService.notify('Member account created!');
      $location.path('/');
    }, function (reason) {
      notifierService.error(reason);
    });
  };
}