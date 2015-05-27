var JerseyImages = require('../models/JerseyImages');
var dirReader = require('dir-reader');
var config = require('../config/config');
var errorHandler = require('../utilities/errorHandler');

exports.getJerseyImages = function(req, res) {
  var jerseyImages = [];
  var dir = config.jerseyImagesPath;
  dirReader.getDirItems(dir, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    var i = 0;
    for(i = 0; i < files.length; i++) {
      var jerseyImage = new JerseyImages({path: config.jerseyImagesUrl, name: files[i].fileName});
      jerseyImages.push(jerseyImage);
    }
    return res.send(jerseyImages);
  });
};