angular.module('app').factory('Member', ['$resource', Member]);
function Member($resource) {
  var member = $resource('/api/members', {}, {});
  return member;
}