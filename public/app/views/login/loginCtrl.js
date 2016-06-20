angular.module('app').controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$scope', '$location', '$window', 'notifierService', 'authorizationService', 'configService'];
function loginCtrl($scope, $location, $window, notifierService, authorizationService, configService) {
  var forceSSL = function() {
    if ($location.protocol() !== 'https') {
      $window.location.href = $location.absUrl().replace('http', 'https').replace(configService.config.port, configService.config.sslport);
    }
  }
  forceSSL();
  $scope.login = function() {
    authorizationService.authenticateMember($scope.loginUsername, $scope.loginPassword).then(function(success) {
      if (success) {
        notifierService.notify('You have successfully signed in!');
        $location.path('/');
      } else {
        notifierService.error('Username/Password combination incorrect');
      }
    });
  };
}