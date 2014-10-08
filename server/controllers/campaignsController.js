var Campaign = require('../models/Campaign');
var dirReader = require('dir-reader');
var config = require('../config/config');
var errorHandler = require('../utilities/errorHandler');

exports.getCampaigns = function(req, res) {
  console.log('in getCampaigns');
  var campaigns = [];
  var dir = config.campaignsPath;
  dirReader.getDirItems(dir, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    var i = 0;
    for(i = 0; i < files.length; i++) {
      var campaign = new Campaign();
      campaign.name = files[i].fileName.replace('.html', '');
      campaigns.push(campaign);
    }
    return res.send(campaigns);
  });
};

exports.getCampaign = function(req, res) {
  var dir = config.campaignsPath;
  var campaignName = req.params.name;
  dirReader.getFileContents(dir, campaignName + '.html', function (err, data) {
    if(err) { errorHandler.sendError(req, res, err); }
    res.set('Content-Type', 'text/html');
    return res.send(data.fileContent);
  });
};