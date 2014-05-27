angular.module('app').factory('Member', function($resource) {
  var Member = $resource('/api/members', {}, {});
  return Member;
})