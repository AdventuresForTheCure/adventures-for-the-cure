var SponsorLogo = require('../models/SponsorLogo');
var dirReader = require('dir-reader');
var config = require('../config/config');
var errorHandler = require('../utilities/errorHandler');

exports.getSponsorLogos = function(req, res) {
  var sponsorLogos = [];
  var dir = config.sponsorLogosPath;
  dirReader.getDirItems(dir, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    var i = 0;
    for(i = 0; i < files.length; i++) {
      var sponsorLogo = new SponsorLogo({path: config.sponsorLogosUrl, name: files[i].fileName});
      sponsorLogos.push(sponsorLogo);
    }
    return res.send(sponsorLogos);
  });
};