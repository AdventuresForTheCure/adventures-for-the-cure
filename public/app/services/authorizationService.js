angular.module('app').factory('authorizationService',
  ['$http', '$q', 'identityService', 'Member', authorizationService]);
function authorizationService($http, $q, identityService, Member) {
  return {
    authenticateMember: function(username, password) {
      var deferred = $q.defer();
      $http.post('/login', {username: username, password: password}).then(function(response) {
        if (response.data.success) {
          var member = new Member();
          angular.extend(member, response.data.member);
          identityService.currentMember = member;
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      } );
      return deferred.promise;
    },

    logoutMember: function() {
      var deferred = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        identityService.currentMember = undefined;
        deferred.resolve();
      });
      return deferred.promise;
    },

    authorizeAuthorizedMemberForRoute: function(role) {
      if (!role && identityService.isAuthenticated()) {
        return true;
      } else if (identityService.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    authorizeAuthorizedMemberWithFullProfileForRoute: function(role) {
      if (!role && identityService.isAuthenticated()) {
        return checkForActiveMemberAndBioAndPic();
      } else if (identityService.isAuthorized(role)) {
        return checkForActiveMemberAndBioAndPic();
      } else {
        return $q.reject('not authorized');
      }
    },

    authorizeAuthenticatedMemberForRoute: function($route) {
      if (identityService.isAuthenticated() &&
        ($route.current.params.id === identityService.currentMember._id ||
          identityService.isAuthorized('admin'))) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    createMember: function(newMemberData) {
      var newMember = new Member(newMemberData);
      var deferred = $q.defer();

      newMember.$save().then(function() {
        identityService.currentMember = newMember;
        deferred.resolve();
      }, function(response) {
        deferred.reject(response.data.reason);
      });

      return deferred.promise;
    }
  };

  function checkForActiveMemberAndBioAndPic() {
    if (identityService.currentMember.isActive === false) {
      return $q.reject('not authorized, membership is not active');
    } else if (!identityService.currentMember.bio || identityService.currentMember.bio.length <= 0 ||
               !identityService.currentMember.imgPath || identityService.currentMember.imgPath.length <= 0) {
      return $q.reject('not authorized, profile not complete');
    } else {
      return true;
    }
  };
}