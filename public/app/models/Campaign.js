angular.module('app').factory('Campaign', function($resource) {
  var Campaign = $resource('/api/campaigns', {}, {});
  return Campaign;
})