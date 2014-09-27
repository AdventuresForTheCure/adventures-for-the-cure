angular.module('app').factory('identityService', identityService);
identityService.$inject = ['$window', 'User'];
function identityService($window, User) {
  var currentUser;
  if ($window.bootstrappedUserObject) {
    currentUser = new User();
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
    }
  }
}