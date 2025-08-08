angular.module('app').factory('Member', ['$resource', Member]);
function Member($resource) {
  var member = $resource('/api/members', {}, {});

  member.prototype.isAdmin = function () {
    return this.isRole('admin');
  };
  member.prototype.setAdmin = function (isSet) {
    this.setRole('admin', isSet);
  };

  member.prototype.isInventory = function () {
    return this.isRole('inventory');
  };
  member.prototype.setInventory = function (isSet) {
    this.setRole('inventory', isSet);
  };

  member.prototype.isBoard = function () {
    return this.isRole('board');
  };
  member.prototype.setBoard = function (isSet) {
    this.setRole('board', isSet);
  };

  member.prototype.isRole = function (roleName) {
    return this.roles && this.roles.indexOf(roleName) > -1;
  };
  member.prototype.setRole = function (roleName, isSet) {
    if (isSet && this.roles.indexOf(roleName) === -1) {
      this.roles.push(roleName);
    } else {
      var roleIndex = this.roles.indexOf(roleName);
      this.roles.splice(roleIndex, 1);
    }
  };
  return member;
}
