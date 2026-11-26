var config = require('../config/config');
var contentFiles = require('../utilities/contentFiles');

exports.getCampaigns = async function(req, res, next) {
  try {
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    res.json(files.map(function(fileName) { return {name: fileName.slice(0, -5)}; }));
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
