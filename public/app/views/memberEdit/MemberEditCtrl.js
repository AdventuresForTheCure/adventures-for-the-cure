angular.module('app').controller('memberEditCtrl', memberEditCtrl);
memberEditCtrl.$inject = ['$scope', '$route', '$location', 'notifierService', 'memberService', 'identityService'];
function memberEditCtrl($scope, $route, $location, notifierService, memberService, identityService) {
  $scope.identity = identityService;
  $scope.memberToEdit = undefined;

  memberService.getMember($route.current.params.id).then(function(member) {
    $scope.memberToEdit = member;
  });

  $scope.saveMember = function() {
    memberService.saveMember($scope.memberToEdit).then(function(member) {
      $scope.memberToEdit = member;
      if ($scope.identity.currentUser._id === $scope.memberToEdit._id) {
        angular.extend(identityService.currentUser, $scope.memberToEdit);
      }
      notifierService.notify('Member has been updated');
      $location.path('/member-list');
    }, function(reason) {
      notifierService.error(reason);
    });
  };
}