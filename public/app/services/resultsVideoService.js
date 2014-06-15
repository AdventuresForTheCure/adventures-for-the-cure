angular.module('app').factory('videoService', function($q, $http, Video) {
  return {
    getVideos: function() {
      return Video.query().$promise;
    },
    getVideo: function(name) {
      // because we need to get a html file as the content for a given video
      // we must use the $http.get method and not the Video resource.  The Video
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/videos/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
})