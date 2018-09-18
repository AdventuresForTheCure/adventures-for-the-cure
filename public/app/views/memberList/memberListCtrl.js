// angular.module('app').controller('memberListCtrl', memberListCtrl);
// memberListCtrl.$inject = ['$scope', '$location', 'notifierService', 'memberService', 'identityService', 'confirmModalService'];
// function memberListCtrl($scope, $location, notifierService, memberService, identityService, confirmModalService) {
//   $scope.identity = identityService;
//
//   function getMembers() {
//     memberService.getMembers().then(function (members) {
//       $scope.members = members;
//     });
//   }
//
//   $scope.editMember = function(member) {
//     $location.path('/member-edit/' + member._id);
//   };
//
//   $scope.deleteMember = function(member) {
//     var message = 'Are you sure you want to delete the member: ' + member.name + ' <' + member.username + '>?';
//     confirmModalService.showModal(message).then(function(isConfirmed) {
//       if (isConfirmed) {
//         memberService.deleteMember(member).then(function() {
//           notifierService.notify('Member ' + member.username + ' has been deleted');
//           getMembers();
//         }, function(reason) {
//           notifierService.error(reason);
//         });
//       }
//     })
//   };
//
//   $scope.deactivateMembership = function(member) {
//     member.isActive = false;
//     memberService.updateActiveStatus(member).then(function() {
//       notifierService.notify('Member ' + member.username + ' has been deactivated');
//       getMembers();
//     }, function(reason) {
//       notifierService.error(reason);
//     });
//   }
//
//   $scope.activateMembership = function(member) {
//     member.isActive = true;
//     memberService.updateActiveStatus(member).then(function() {
//       notifierService.notify('Member ' + member.username + ' has been activated');
//       getMembers();
//     }, function(reason) {
//       notifierService.error(reason);
//     });
//   }
//
//   getMembers();
// }