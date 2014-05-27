angular.module('app').controller('membersCtrl', function($scope, $sce, memberService) {
  $scope.selectedMemberHtml = "";
  memberService.getMembers().then(function(members) {
    $scope.members = members.slice(0, (members.length / 2));
    $scope.members2 = members.slice((members.length / 2), members.length);
  })

  $scope.selectMember = function(member) {
    memberService.getMember(member.name).then(function(memberHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedMemberHtml = $sce.trustAsHtml(memberHtml);
    })
  }
});
