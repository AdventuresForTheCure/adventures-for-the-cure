// angular.module('app').controller('loginCtrl', loginCtrl);
// loginCtrl.$inject = ['$scope', '$location', '$window', 'notifierService', 'authorizationService', 'configService'];
// function loginCtrl($scope, $location, $window, notifierService, authorizationService, configService) {
//   $scope.login = function() {
//     authorizationService.authenticateMember($scope.loginUsername, $scope.loginPassword).then(function(success) {
//       if (success) {
//         notifierService.notify('You have successfully signed in!');
//         $location.path('/');
//       } else {
//         notifierService.error('Username/Password combination incorrect');
//       }
//     });
//   };
// }