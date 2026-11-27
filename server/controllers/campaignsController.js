var config = require('../config/config');
var contentFiles = require('../utilities/contentFiles');
var campaignSlugs = require('../utilities/campaignSlugs');

exports.getCampaigns = async function(req, res, next) {
  try {
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    var names = files.map(function(fileName) { return fileName.slice(0, -5); });
    res.json(campaignSlugs.createCampaignEntries(names));
  } catch (error) {
    next(error);
  }
};

exports.getCampaign = async function(req, res, next) {
  try {
    var html = await contentFiles.readContent(config.campaignsPath, req.params.name, '.html');
    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
};
