angular.module('app').factory('memberService', function($q, $http, Member) {
  return {
    getMembers: function() {
      return Member.query().$promise;
    },
    getMember: function(name) {
      // because we need to get a html file as the content for a given member
      // we must use the $http.get method and not the Member resource.  The Member
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/members/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
})