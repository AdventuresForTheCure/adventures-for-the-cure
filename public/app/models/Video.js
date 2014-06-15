angular.module('app').factory('Video', function($resource) {
  var Video = $resource('/api/video', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return Video;
})