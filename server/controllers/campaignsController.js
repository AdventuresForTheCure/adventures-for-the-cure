var Campaign = require('../models/Campaign'),
  readDirFiles = require('read-dir-files')
  fs = require('fs'),
  foreach = require('foreach'),
  config = require('../config/config'),
  errorHandler = require('../utilities/errorHandler');

exports.getCampaigns = function(req, res) {
  var campaigns = [];
  var dir = config.paths.campaignsPath;
  var options = {
    recursive: false,
    normalize: true
  }
  readDirFiles.read(dir, options, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    foreach(files, function (fileContents, fileName, object) {
      var campaign = Object.create(Campaign);
      campaign.name = fileName;
      campaigns.push(campaign);
    });
    return res.send(campaigns);
  });
};

exports.getCampaign = function(req, res) {
  var dir = config.paths.campaignsPath;
  var campaignName = req.params.name;
  fs.readFile(dir + campaignName, 'utf8', function (err, data) {
    if(err) { errorHandler.sendError(req, res, err); }
    console.log(data);
    res.set('Content-Type', 'text/html');
    return res.send(data);
  });
};