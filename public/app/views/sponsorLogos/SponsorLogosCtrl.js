angular.module('app').controller('sponsorLogosCtrl', sponsorLogosCtrl);
sponsorLogosCtrl.$inject = ['$scope', 'sponsorLogosService'];
function sponsorLogosCtrl($scope, sponsorLogosService) {
  sponsorLogosService.getSponsorLogos().then(function(sponsorLogos) {
    $scope.sponsorLogos = sponsorLogos;
  });
}

