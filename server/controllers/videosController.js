var Video = require('../models/Video');
var dirReader = require('dir-reader');
var config = require('../config/config');
var errorHandler = require('../utilities/errorHandler');

exports.getVideos = function(req, res) {
  var videos = [];
  var dir = config.videosPath;
  dirReader.getDirItems(dir, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    var i = 0;
    for(i = 0; i < files.length; i++) {
      var video = new Video();
      video.name = files[i].fileName.replace('.html', '');
      videos.push(video);
    }
    return res.send(videos);
  });
};

exports.getVideo = function(req, res) {
  var dir = config.videosPath;
  var videoName = req.params.name;
  dirReader.getFileContents(dir, videoName + '.html', function (err, data) {
    if(err) { errorHandler.sendError(req, res, err); }
    res.set('Content-Type', 'text/html');
    return res.send(data.fileContent);
  });
};