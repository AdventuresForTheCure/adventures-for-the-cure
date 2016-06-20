angular.module('app').factory('configService', ['$window', configService]);
function configService($window) {
  var config = {}
  if ($window.config) {
    angular.extend(config, $window.config);
  }
  return {
    config: config
  };
}