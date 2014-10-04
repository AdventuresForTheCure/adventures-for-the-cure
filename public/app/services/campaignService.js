angular.module('app').factory('campaignService', ['$q', '$http', 'Campaign', campaignService]);
function campaignService($q, $http, Campaign) {
  return {
    getCampaigns: function() {
      return Campaign.query().$promise;
    },
    getCampaign: function(name) {
      // because we need to get a html file as the content for a given campaign
      // we must use the $http.get method and not the Campaign resource.  The Campaign
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/campaigns/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
}