angular.module('app').factory('videoService', ['$q', '$http', videoService]);
function videoService($q, $http) {
  return {
    getVideos: function () {
      var dfd = $q.defer();
      $http
        .get('/api/videos')
        .success(function (data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function (error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },
    getVideo: function (name) {
      var dfd = $q.defer();
      $http
        .get('/api/videos/' + name)
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
