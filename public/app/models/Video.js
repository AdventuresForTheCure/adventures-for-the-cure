angular.module('app').factory('Video', ['$resource', Video]);
function Video($resource) {
  var video = $resource('/api/video', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return video;
}