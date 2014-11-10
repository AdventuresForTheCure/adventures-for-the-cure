angular.module('app').controller('memberCreateCtrl', memberCreateCtrl);
memberCreateCtrl.$inject = ['$scope', '$location', 'notifierService', 'memberService'];
function memberCreateCtrl($scope, $location, notifierService, memberService) {
  $scope.name = '';
  $scope.username = '';
  $scope.password = '';
  $scope.confirmPassword = '';
  $scope.bio = '';
  $scope.roles = [];
  $scope.img = undefined;
  $scope.notifierService = notifierService;

  $scope.createMember = function() {
    // if the form is valid then submit to the server
    if ($scope.memberCreateForm.$valid) {
      var newMember = {
        name: $scope.name,
        username: $scope.username,
        roles: $scope.roles,
        bio: $scope.bio,
        img: $scope.img
      };
      if($scope.password && $scope.password.length > 0) {
        newMember.password = $scope.password;
      }

      memberService.saveMember(newMember).then(function() {
        notifierService.notify('Member ' + newMember.username + ' has been created');
        $location.path('/views/memberList/member-list');
      }, function(reason) {
        notifierService.error(reason);
      });
    }
  };

  $scope.onFileSelect = function($files) {
    $scope.img = $files[0];
  };
}