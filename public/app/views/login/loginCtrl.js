angular.module('app').controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$scope', '$location', 'notifierService', 'authorizationService'];
function loginCtrl($scope, $location, notifierService, authorizationService) {
  $scope.login = function() {
    authorizationService.authenticateUser($scope.loginUsername, $scope.loginPassword).then(function(success) {
      if (success) {
        notifierService.notify('You have successfully signed in!');
        $location.path('/');
      } else {
        notifierService.error('Username/Password combination incorrect');
      }
    });
  };
}