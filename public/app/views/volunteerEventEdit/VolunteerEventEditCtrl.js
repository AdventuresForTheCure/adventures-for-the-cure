angular.module('app').controller('volunteerEventEditCtrl', volunteerEventEditCtrl);
volunteerEventEditCtrl.$inject = ['$scope', '$route', 'notifierService', 'volunteerEventService', 'identityService'];
function volunteerEventEditCtrl($scope, $route, notifierService, volunteerEventService, identityService) {
  $scope.identityService = identityService;
  $scope.volunteerEventToEdit = undefined;
  $scope.showImgTmp = false;

  volunteerEventService.getVolunteerEvent($route.current.params.id).then(function(volunteerEvent) {
    $scope.volunteerEventToEdit = volunteerEvent;
  });

  $scope.saveVolunteerEvent = function() {
    volunteerEventService.saveVolunteerEvent($scope.volunteerEventToEdit).then(function(volunteerEvent) {
      $scope.volunteerEventToEdit = volunteerEvent;
      notifierService.notify('Volunteer event has been updated');
    }, function(reason) {
      notifierService.error(reason);
    });
  };

  $scope.onFileSelect = function($files) {
    $scope.volunteerEventToEdit.imgTmp = $files[0];
    volunteerEventService.saveVolunteerEventTmpImg($scope.volunteerEventToEdit).then(function(volunteerEvent) {
      $scope.volunteerEventToEdit = volunteerEvent;
      $scope.volunteerEventToEdit.img = $files[0];
      $scope.showImgTmp = true;
    });
  };
}