angular.module('app').factory('Member', ['$resource', Member]);
function Member($resource) {
  var member = $resource('/api/members', {}, {});

  member.prototype.isAdmin = function() {
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  member.prototype.isInventory = function() {
    return this.roles && this.roles.indexOf('inventory') > -1;
  };
  return member;
}