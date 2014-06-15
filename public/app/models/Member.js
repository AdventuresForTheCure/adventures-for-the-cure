angular.module('app').factory('Member', function($resource) {
  var Member = $resource('/api/members', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return Member;
})