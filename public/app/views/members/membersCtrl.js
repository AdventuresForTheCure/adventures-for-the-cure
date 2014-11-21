angular.module('app').controller('membersCtrl', membersCtrl);
membersCtrl.$inject = ['$scope', '$location', '$window', 'memberService', 'notifierService', 'identityService'];
function membersCtrl($scope, $location, $window, memberService, notifierService, identityService) {
  $scope.selectedMember = {};
  $scope.selectedMemberHtml = '';
  $scope.editMode = false;
  $scope.showImgTmp = false;
  $scope.notifierService = notifierService;

  memberService.getMembers().then(function(members) {
    $scope.allMembers = members;
    $scope.membersColumn1 = members.slice(0, (members.length / 2) + 1);
    $scope.membersColumn2 = members.slice((members.length / 2) + 1, members.length);
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
//    $location.hash($scope.selectedMember.name);
    var currHash = $window.location.hash.substring(1, $window.location.hash.length);
    if (currHash !== $scope.selectedMember.name) {
      $window.location.hash = $scope.selectedMember.name;
    }
  };

  $scope.saveMember = function() {
    var member = $scope.selectedMember;
    memberService.saveMember($scope.selectedMember).then(function(member) {
      $scope.selectMember(member);
      $scope.editMode = false;
      $scope.showImgTmp = false;
    });
  };

  $scope.onFileSelect = function($files) {
    $scope.selectedMember.imgTmp = $files[0];
    memberService.saveMemberTmpImg($scope.selectedMember).then(function(member) {
      $scope.selectMember(member);
      $scope.selectedMember.img = $files[0];
      $scope.showImgTmp = true;
    });
  };

  $scope.enableEditMode = function() {
    $scope.editMode = true;
  };

  $scope.cancel = function() {
    $scope.editMode = false;
    $scope.showImgTmp = false;
  };
}
