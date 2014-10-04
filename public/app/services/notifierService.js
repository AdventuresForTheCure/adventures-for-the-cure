angular.module('app').factory('notifierService', ['toastrService', notifierService]);
function notifierService(toastrService) {
  return {
    notify: function(msg) {
      toastrService.success(msg);
    },
    error: function(msg) {
      toastrService.error(msg);
    }
  };
}