angular.module('app').controller('createMemberCtrl', createMemberCtrl);
createMemberCtrl.$inject = ['$scope', '$location', 'notifierService', 'userService'];
function createMemberCtrl($scope, $location, notifierService, userService) {
  $scope.username = '';
  $scope.password = '';
  $scope.roles = [];

  $scope.createMember = function() {
    // if the form is valid then submit to the server
    if ($scope.createMemberForm.$valid) {
      var newUser = {
        username: $scope.username,
        roles: $scope.roles
      };
      if($scope.password && $scope.password.length > 0) {
        newUser.password = $scope.password;
      }

      userService.saveUserDataAsNewUser(newUser).then(function() {
        notifierService.notify('User ' + newUser.username + ' has been created');
        $location.path('/views/userList/user-list');
      }, function(reason) {
        notifierService.error(reason);
      });
    }
  };
}