angular.module('app').factory('User', ['$resource', User]);
function User($resource) {
  var user = $resource('/api/users/:id', {id: '@_id'}, {});

  user.prototype.isAdmin = function() {
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  user.prototype.isBoard = function() {
    return this.roles && this.roles.indexOf('board') > -1;
  };

  return user;
}