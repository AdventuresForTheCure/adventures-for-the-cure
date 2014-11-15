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
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    },
    isAdmin: function() {
      return !!this.currentUser && this.currentUser.roles.indexOf('admin') > -1;
    },
    isBoard: function() {
      return !!this.currentUser && this.currentUser.roles.indexOf('board') > -1;
    },
    isInventory: function() {
      return !!this.currentUser && this.currentUser.roles.indexOf('inventory') > -1;
    }
  };
}