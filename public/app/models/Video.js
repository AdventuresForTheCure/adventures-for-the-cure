angular.module('app').factory('Video', function($resource) {
  var Video = $resource('/api/video', {}, {});
  return Video;
})