angular.module('app').controller('membersCtrl', membersCtrl);
membersCtrl.$inject = ['$scope', '$location', 'memberService', 'notifierService', 'identityService'];
function membersCtrl($scope, $location, memberService, notifierService, identityService) {
  $scope.selectedMember = undefined;
  $scope.selectedMemberHtml = '';
  $scope.editMode = false;
  $scope.notifierService = notifierService;

  memberService.getMembers().then(function(members) {
    $scope.allMembers = members;
    $scope.membersColumn1 = members.slice(0, (members.length / 2));
    $scope.membersColumn2 = members.slice((members.length / 2), members.length);
    var selectedMemberName = $location.hash();
    for (var i = 0; i < members.length; i++) {
      if (members[i].name === selectedMemberName) {
        $scope.selectMember(members[i]);
      } else if (selectedMemberName === '' && members[i].name === 'Adam Driscoll') {
        $scope.selectMember(members[i]);
      }
    }
  });

  $scope.ableToEdit = function() {
    if ($scope.selectedMember &&
        identityService.isAuthenticated() &&
       ($scope.selectedMember.username === identityService.currentUser.username ||
        identityService.currentUser.isAdmin())) {
      return true;
    } else {
      return false;
    }
  };

  $scope.selectMember = function(member) {
    $scope.selectedMember = member;
    $location.hash($scope.selectedMember.name);
  };

  $scope.saveMember = function() {
    memberService.saveMember($scope.selectedMember).then(function(member) {
      $scope.selectedMember = member;
      $scope.editMode = false;
    });
  };

  $scope.onFileSelect = function($files) {
    $scope.selectedMember.img = $files[0];
  };

  $scope.enableEditMode = function() {
    $scope.editMode = true;
  };
}
