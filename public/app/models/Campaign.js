angular.module('app').factory('Campaign', Campaign);
Campaign.$inject = ['$resource'];
function Campaign($resource) {
  var Campaign = $resource('/api/campaigns', {}, {});
  return Campaign;
}