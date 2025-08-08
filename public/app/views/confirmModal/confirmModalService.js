angular.module('app').factory('confirmModalService', ['$modal', '$q', confirmModalService]);
function confirmModalService($modal, $q) {
  return {
    showModal: function (message) {
      var deferred = $q.defer();
      var modalInstance = $modal.open({
        templateUrl: '/partials/confirmModal/confirm-modal',
        controller: confirmModalCtrl,
        resolve: {
          message: function () {
            return message;
          },
        },
      });
      modalInstance.result.then(function () {
        deferred.resolve(true);
      });
      return deferred.promise;
    },
  };
}
