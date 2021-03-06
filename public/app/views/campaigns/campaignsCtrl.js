angular.module('app').controller('campaignsCtrl', campaignsCtrl);
campaignsCtrl.$inject = ['$scope', '$sce', '$location', 'campaignService'];
function campaignsCtrl($scope, $sce, $location, campaignService) {
  $scope.selectedCampaign = undefined;
  $scope.selectedCampaignHtml = '';

  campaignService.getCampaigns().then(function(campaigns) {
    $scope.campaigns = campaigns;
    var selectedCampaignName = $location.hash();
    if (selectedCampaignName === '') {
      $scope.selectCampaign(campaigns[campaigns.length-1]);
    } else {
      var campaign;
      for (var i = 0; i < campaigns.length; i++) {
        if (campaigns[i].name === selectedCampaignName) {
          campaign = campaigns[i];
        }
      }
      if (campaign) {
        campaignService.getCampaign(campaign.name).then(function (campaignHtml) {
          // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
          $scope.selectedCampaign = campaign;
          $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
        });
      }
    }
  });

  $scope.selectCampaign = function(campaign) {
    campaignService.getCampaign(campaign.name).then(function(campaignHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedCampaign = campaign;
      $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
      $location.hash($scope.selectedCampaign.name);
    });
  };
}

