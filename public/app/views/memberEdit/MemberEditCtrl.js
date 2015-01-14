angular.module('app').controller('memberEditCtrl', memberEditCtrl);
memberEditCtrl.$inject = ['$scope', '$route', 'notifierService', 'memberService', 'identityService'];
function memberEditCtrl($scope, $route, notifierService, memberService, identityService) {
  $scope.identityService = identityService;
  $scope.memberToEdit = undefined;
  $scope.showImgTmp = false;
  $scope.loadingTmpImg = false;

  memberService.getMember($route.current.params.id).then(function(member) {
    $scope.memberToEdit = member;
  });

  $scope.saveMember = function() {
    memberService.saveMember($scope.memberToEdit).then(function(member) {
      $scope.memberToEdit = member;
      if (identityService.currentMember._id === $scope.memberToEdit._id) {
        angular.extend(identityService.currentMember, $scope.memberToEdit);
      }
      notifierService.notify('Member has been updated');
    }, function(reason) {
      notifierService.error('Error saving member data, please try again...');
    });
  };

  $scope.onFileSelect = function($files) {
    $scope.memberToEdit.imgTmp = $files[0];
    $scope.loadingTmpImg = true;
    memberService.saveMemberTmpImg($scope.memberToEdit).then(function(member) {
      $scope.showImgTmp = true;
      $scope.loadingTmpImg = false;
      $scope.memberToEdit.imgPathTmp = member.imgPathTmp;
      $scope.memberToEdit.img = $files[0];
    }, function(reason) {
      $scope.showImgTmp = false;
      $scope.loadingTmpImg = false;
      notifierService.error('Error uploading image, please try again...');
    });
  };

  $scope.isInvalid = function() {
    var invalid = false;
    if ($scope.memberEditForm.$invalid || $scope.loadingTmpImg) {
      invalid = true;
    }
    return invalid;
  };
}