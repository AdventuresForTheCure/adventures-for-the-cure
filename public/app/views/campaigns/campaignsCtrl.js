angular.module('app').controller('campaignsCtrl', function($scope, $sce, campaignService) {
  $scope.selectedCampaignHtml = "";
  $scope.campaigns = campaignService.getCampaigns();

  $scope.selectCampaign = function(campaign) {
    campaignService.getCampaign(campaign.name).then(function(campaignHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
    })
  }
});
