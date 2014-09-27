angular.module('app').factory('Member', Member);
Member.$inject = ['$resource'];
function Member($resource) {
  var Member = $resource('/api/members', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return Member;
}