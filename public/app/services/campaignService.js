angular.module('app').factory('campaignService', ['$q', '$http', campaignService]);
function campaignService($q, $http, Campaign) {
  return {
    getCampaigns: function() {
      var dfd = $q.defer();
      $http.get('/api/campaigns/')
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },
    getCampaign: function(name) {
      var dfd = $q.defer();
      $http.get('/api/campaigns/' + name)
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        }).error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    }
  };
}