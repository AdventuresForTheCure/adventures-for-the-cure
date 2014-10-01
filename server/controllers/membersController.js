var Member = require('../models/Member'),
  readDirFiles = require('read-dir-files')
  fs = require('fs'),
  foreach = require('foreach'),
  config = require('../config/config'),
  errorHandler = require('../utilities/errorHandler');

exports.getMembers = function(req, res) {
  var members = [];
  var dir = config.membersPath;
  var options = {
    recursive: false,
    normalize: true
  }
  readDirFiles.read(dir, options, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    foreach(files, function (fileContents, fileName, object) {
      var member = Object.create(Member);
      member.name = fileName.replace('.html', '');;
      members.push(member);
    });
    return res.send(members);
  });
};

exports.getMember = function(req, res) {
  var dir = config.membersPath;
  var memberName = req.params.name;
  fs.readFile(dir + memberName + '.html', 'utf8', function (err, data) {
    if(err) { errorHandler.sendError(req, res, err); }
    res.set('Content-Type', 'text/html');
    return res.send(data);
  });
};