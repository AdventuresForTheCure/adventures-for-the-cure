angular.module('app').factory('authorizationService', ['$http', '$q', 'identityService', 'User', authorizationService]);
function authorizationService($http, $q, identityService, User) {
  return {
    authenticateUser: function(username, password) {
      var deferred = $q.defer();
      $http.post('/login', {username: username, password: password}).then(function(response) {
        if (response.data.success) {
          var user = new User();
          angular.extend(user, response.data.user);
          identityService.currentUser = user;
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      } );
      return deferred.promise;
    },

    logoutUser: function() {
      var deferred = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        identityService.currentUser = undefined;
        deferred.resolve();
      });
      return deferred.promise;
    },

    authorizeAuthorizedUserForRoute: function(role)  {
      if (identityService.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    authorizeAuthenticatedUserForRoute: function() {
      if (identityService.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    createUser: function(newUserData) {
      var newUser = new User(newUserData);
      var deferred = $q.defer();

      newUser.$save().then(function() {
        identityService.currentUser = newUser;
        deferred.resolve();
      }, function(response) {
        deferred.reject(response.data.reason);
      });

      return deferred.promise;
    }
  };
}