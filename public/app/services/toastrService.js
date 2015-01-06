/**
 * An angular wrapper around toastr so that it is available as an injectible service
 */
angular.module('app').service('toastrService', ToastrWrapper);

function ToastrWrapper() {
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'positionClass': 'toast-top-full-width',
    'onclick': null,
    'showDuration': '3000',
    'hideDuration': '1000',
    'timeOut': '10000',
    'extendedTimeOut': '2000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  };
  return toastr;
}