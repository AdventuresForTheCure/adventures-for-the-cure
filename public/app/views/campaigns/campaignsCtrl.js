//angular.module('app').controller('campaignsCtrl', function($scope, $sce, campaignService) {
//  $scope.selectedCampaignHtml = "";
//  $scope.campaigns = campaignService.getCampaigns();
//
//  $scope.selectCampaign = function(campaign) {
//    campaignService.getCampaign(campaign.name).then(function(campaignHtml) {
//      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
//      $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
//    })
//  }
//});

angular.module('app').controller('campaignsCtrl', function($scope, $sce, campaignService) {
  $scope.selectedCampaignHtml = "";
  campaignService.getCampaigns().then(function(campaigns) {
    $scope.campaigns = campaigns;
    for (var i = 0; i < campaigns.length; i++) {
      if (campaigns[i].name === "2014-01-01 Miles To The Moon") {
        $scope.selectCampaign(campaigns[i]);
      }
    }
  });

  $scope.selectCampaign = function(campaign) {
    campaignService.getCampaign(campaign.name).then(function(campaignHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
    })
  };
});

