angular.module('app').factory('Video', Video);
Video.$inject = ['$resource'];
function Video($resource) {
  var Video = $resource('/api/video', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return Video;
}