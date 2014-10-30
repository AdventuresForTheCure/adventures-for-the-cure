angular.module('app').factory('memberService', ['$q', '$http', 'Member', memberService]);
function memberService($q, $http, Member) {
  return {
    getMembers: function() {
      var deferred = $q.defer();
      $http.get('/api/members/').then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    },

    getMembersAsAdmin: function() {
      var deferred = $q.defer();
      $http.get('/api/membersAsAdmin/').then(function(response) {
        var members = [];
        for (var i = 0; i < response.data.length; i++) {
          members[i] = new Member(response.data[i]);
        }
        deferred.resolve(members);
      });
      return deferred.promise;
    },

    getMember: function(name) {
      // because we need to get a html file as the content for a given member
      // we must use the $http.get method and not the Member resource.  The Member
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/members/' + name).then(function(response) {
        var member = new Member(response.data);
        deferred.resolve(member);
      });
      return deferred.promise;
    },

    saveMember: function(member) {
      return Member.save(member).$promise;
    },

    saveMemberDataAsNewUser: function(memberData) {
      var member = new Member(memberData);
      var dfd = $q.defer();
      member.$save().then(function(member) {
        dfd.resolve(member);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  };
}