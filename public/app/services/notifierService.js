angular.module('app').factory('notifierService', notifierService);
notifierService.$inject = ['toastrService'];
function notifierService(toastrService) {
  return {
    notify: function(msg) {
      toastrService.success(msg);
    },
    error: function(msg) {
      toastrService.error(msg);
    }
  }
}