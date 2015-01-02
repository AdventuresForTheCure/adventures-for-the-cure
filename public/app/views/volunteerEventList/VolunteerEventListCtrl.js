angular.module('app').controller('volunteerEventListCtrl', volunteerEventListCtrl);
volunteerEventListCtrl.$inject = ['$scope', '$location', '$modal', 'volunteerEventService', 'identityService'];
function volunteerEventListCtrl($scope, $location, $modal, volunteerEventService, identityService) {
  $scope.identity = identityService;

  getVolunteerEvents();

  function getVolunteerEvents() {
    volunteerEventService.getVolunteerEvents().then(function (volunteerEvents) {
      $scope.volunteerEvents = volunteerEvents;
    });
  }

  $scope.editVolunteerEvent = function(volunteerEvent) {
    $location.path('/volunteer-event-edit/' + volunteerEvent._id);
  };

  $scope.deleteVolunteerEvent = function(volunteerEvent) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/volunteerEventList/confirm-delete-volunteer-event-modal',
      controller: confirmDeleteVolunteerEventCtrl,
      resolve: {
        volunteerEvent: function () {
          return volunteerEvent;
        }
      }
    });
    modalInstance.result.then(function() {
      getVolunteerEvents();
    });
  };
}

function confirmDeleteVolunteerEventCtrl($scope, $modalInstance, volunteerEventService, notifierService, volunteerEvent) {
  $scope.volunteerEvent = volunteerEvent;
  $scope.confirm = function () {
    volunteerEventService.deleteVolunteerEvent(volunteerEvent).then(function() {
      notifierService.notify('Volunteer event ' + volunteerEvent.username + ' has been deleted');
    }, function(reason) {
      notifierService.error(reason);
    });
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}
