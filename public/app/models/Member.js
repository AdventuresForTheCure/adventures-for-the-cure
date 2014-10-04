angular.module('app').factory('Member', ['$resource', Member]);
function Member($resource) {
  var member = $resource('/api/members', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return member;
}