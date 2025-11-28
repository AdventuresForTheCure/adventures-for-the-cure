angular.module('app').controller('navbarLoginCtrl', navbarLoginCtrl);
navbarLoginCtrl.$inject = ['$scope', '$location', 'identityService', 'notifierService', 'authorizationService'];
function navbarLoginCtrl($scope, $location, identityService, notifierService, authorizationService) {
  // $scope.identityService = identityService;
  //
  // $scope.signout = function() {
  //   authorizationService.logoutMember().then(function() {
  //     $scope.username = '';
  //     $scope.password = '';
  //     notifierService.notify('You have successfully signed out!');
  //     $location.path('/');
  //   });
  // };

  $scope.isCollapsed = true;

  $scope.toggleCollapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
  };

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  // Close menu when a link is clicked
  $scope.$on('$routeChangeSuccess', function () {
    $scope.isCollapsed = true;
  });
}
