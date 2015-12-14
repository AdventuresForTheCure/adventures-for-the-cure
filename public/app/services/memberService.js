angular.module('app').factory('memberService', ['$q', '$http', '$upload', 'Member', memberService]);
function memberService($q, $http, $upload, Member) {
  function transformResponse(data) {
    data = JSON.parse(data);
    var members = [];
    for (var i = 0; i < data.length; i++) {
      members[i] = new Member(data[i]);
    }
    return members;
  }

  return {
    deleteMember: function(member) {
      var dfd = $q.defer();
      $http.delete('/api/members/' + member._id)
        .success(function(data, status, headers, config) {
          dfd.resolve();
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    getMembers: function() {
      var dfd = $q.defer();
      var config = {
        transformResponse: transformResponse
      };
      $http.get('/api/members/', config)
        .success(function (data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function (error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    getMember: function(name) {
      // because we need to get a html file as the content for a given member
      // we must use the $http.get method and not the Member resource.  The Member
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var dfd = $q.defer();
      $http.get('/api/members/' + name, {})
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
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
    },

    updateActiveStatus: function(member) {
      var dfd = $q.defer();

      if (member.isActive) {
        url = '/api/member/activate/' + member._id;
      } else {
        url = '/api/member/deactivate/' + member._id;
      }
      $http.get(url, {})
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });

      return dfd.promise;
    },

    saveMemberTmpImg: function(member) {
      var dfd = $q.defer();
      var url = '/api/members/tmpImg/' + member._id;

      $upload.upload({
        url: url,
        file: member.imgTmp
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