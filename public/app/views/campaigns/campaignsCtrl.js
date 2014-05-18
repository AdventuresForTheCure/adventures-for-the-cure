angular.module('app').controller('campaignsCtrl', function($scope, $sce, campaignService) {
  $scope.selectedCampaignHtml = "";
  $scope.campaigns = campaignService.getCampaigns();

  $scope.selectCampaign = function(campaign) {
    campaignService.getCampaign(campaign.name).then(function(data) {
      console.log(data);
      $scope.selectedCampaignHtml = $sce.trustAsHtml(data);
    })
  }
});
