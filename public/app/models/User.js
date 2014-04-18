angular.module('app').factory('User', function($resource) {
  var User = $resource('/api/users/:id', {id: "@_id"}, {});

  User.prototype.isAdmin = function() {
    return this.roles && this.roles.indexOf('admin') > -1;
  }

  User.prototype.isBoard = function() {
    return this.roles && this.roles.indexOf('board') > -1;
  }

  return User;
})