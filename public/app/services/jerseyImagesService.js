angular.module('app').factory('jerseyImagesService', ['$q', '$http', jerseyImagesService]);
function jerseyImagesService($q, $http, Campaign) {
  return {
    getJerseyImages: function () {
      var dfd = $q.defer();
      $http
        .get('/api/jerseyImages/')
        .success(function (data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function (error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },
  };
}
