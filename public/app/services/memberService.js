angular.module('app').factory('memberService', ['$q', '$http', '$upload', 'Member', memberService]);
function memberService($q, $http, $upload, Member) {
  return {
    deleteMember: function(user) {
      var dfd = $q.defer();
      $http.delete('/api/members/' + user._id).then(function(response) {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    getMembers: function() {
      var dfd = $q.defer();
      $http.get('/api/members/').then(function(response) {
        var members = [];
        for (var i = 0; i < response.data.length; i++) {
          members[i] = new Member(response.data[i]);
        }
        dfd.resolve(members);
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    getMembersAsAdmin: function() {
      var dfd = $q.defer();
      $http.get('/api/membersAsAdmin/').then(function(response) {
        var members = [];
        for (var i = 0; i < response.data.length; i++) {
          members[i] = new Member(response.data[i]);
        }
        dfd.resolve(members);
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    getMember: function(name) {
      // because we need to get a html file as the content for a given member
      // we must use the $http.get method and not the Member resource.  The Member
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var dfd = $q.defer();
      $http.get('/api/members/' + name).then(function(response) {
        var member = new Member(response.data);
        dfd.resolve(member);
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    saveMember: function(member) {
      var dfd = $q.defer();

      // if the member has an id then it is an 'update'
      // otherwise it is a 'create new'
      var url = '/api/members/';
      if (member._id) {
        url = '/api/members/' + member._id;
      }

      $upload.upload({
        url: url,
        data: member,
        file: member.img
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
        dfd.resolve(data);
      }).error(function(error, status, headers, config) {
        console.log(error);
        dfd.reject(error.reason);
      });

      return dfd.promise;
    }
  };
}