angular.module('app').factory('identityService', ['$window', 'Member', identityService]);
function identityService($window, Member) {
  var currentMember;
  if ($window.bootstrappedMemberObject) {
    currentMember = new Member();
    angular.extend(currentMember, $window.bootstrappedMemberObject);
  }
  return {
    currentMember: currentMember,
    isAuthenticated: function () {
      return !!this.currentMember;
    },
    isAuthorized: function (role) {
      return !!this.currentMember && this.currentMember.isRole(role);
    },
    isAdmin: function () {
      return !!this.currentMember && this.currentMember.isRole('admin');
    },
    isBoard: function () {
      return !!this.currentMember && this.currentMember.isRole('board');
    },
    isInventory: function () {
      return !!this.currentMember && this.currentMember.isRole('inventory');
    },
  };
}
