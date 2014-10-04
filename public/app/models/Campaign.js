angular.module('app').factory('Campaign', ['$resource', Campaign]);
function Campaign($resource) {
  var campaign = $resource('/api/campaigns', {}, {});
  return campaign;
}