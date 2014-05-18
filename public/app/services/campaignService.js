angular.module('app').factory('campaignService', function($q, $http, Campaign) {
  return {
    getCampaigns: function() {
      return Campaign.query();
    },
    getCampaign: function(name) {
      var deferred = $q.defer();

      $http.get('/api/campaigns/' + name).then(function(response) {
        deferred.resolve(response.data);
      });

      return deferred.promise;
    }
  };
})