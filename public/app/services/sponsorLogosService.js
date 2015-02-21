angular.module('app').factory('sponsorLogosService', ['$q', '$http', sponsorLogosService]);
function sponsorLogosService($q, $http, Campaign) {
  return {
    getSponsorLogos: function() {
      var dfd = $q.defer();
      $http.get('/api/sponsorLogos/')
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    }
  };
}