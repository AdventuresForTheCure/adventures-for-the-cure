angular.module('app').controller('volunteerEventCreateCtrl', volunteerEventCreateCtrl);
volunteerEventCreateCtrl.$inject = ['$scope', '$location', 'notifierService', 'volunteerEventService'];
function volunteerEventCreateCtrl($scope, $location, notifierService, volunteerEventService) {
  $scope.name = '';
  $scope.date = '';
  $scope.isAfcEvent = true;
  $scope.img = undefined;

  $scope.notifierService = notifierService;

  $scope.createVolunteerEvent = function() {
    // if the form is valid then submit to the server
    if ($scope.createVolunteerEventForm.$valid) {
      var newVolunteerEvent = {
        name: $scope.name,
        date: $scope.date,
        isAfcEvent: $scope.isAfcEvent,
        img: $scope.img
      };

      volunteerEventService.saveVolunteerEvent(newVolunteerEvent).then(function() {
        notifierService.notify('VolunteerEvent ' + newVolunteerEvent.username + ' has been created');
        $location.path('/volunteer-event-list');
      }, function(reason) {
        notifierService.error(reason);
      });
    }
  };

  $scope.onFileSelect = function($files) {
    $scope.img = $files[0];
  };
}