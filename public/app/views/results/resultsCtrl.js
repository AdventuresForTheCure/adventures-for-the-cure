angular.module('app').controller('resultsCtrl', resultsCtrl);
resultsCtrl.$inject = ['$scope', '$sce', 'videoService'];
function resultsCtrl($scope, $sce, videoService) {
  $scope.selectedVideoHtml = '';

  videoService.getVideos().then(function (videos) {
    $scope.videos = videos;
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].name === '2014--04-06 AFC Sugar Hill XC') {
        $scope.selectVideo(videos[i]);
      }
    }
  });

  $scope.selectVideo = function (video) {
    videoService.getVideo(video.name).then(function (videoHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedVideoHtml = $sce.trustAsHtml(videoHtml);
    });
  };
}
