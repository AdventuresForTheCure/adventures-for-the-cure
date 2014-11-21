angular.module('app').factory('identityService', ['$window', 'Member', identityService]);
function identityService($window, Member) {
  var currentUser;
  if ($window.bootstrappedUserObject) {
    currentUser = new Member();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.isRole(role);
    },
    isAdmin: function() {
      return !!this.currentUser && this.currentUser.isRole('admin');
    },
    isBoard: function() {
      return !!this.currentUser && this.currentUser.isRole('board');
    },
    isInventory: function() {
      return !!this.currentUser && this.currentUser.isRole('inventory');
    }
  };
}