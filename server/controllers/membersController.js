var Member = require('../models/Member');
var dirReader = require('dir-reader');
var fs = require('fs');
var foreach = require('foreach');
var config = require('../config/config');
var errorHandler = require('../utilities/errorHandler');

exports.getMembers = function(req, res) {
  var members = [];
  var dir = config.membersPath;
  var options = {
    recursive: false,
    normalize: true
  }
  dirReader.getDirItems(dir, function(err, files) {
    if(err) { errorHandler.sendError(req, res, err); }
    var i = 0;
    for(i = 0; i < files.length; i++) {
      var member = new Member();
      member.name = files[i].fileName.replace('.html', '');
      members.push(member);
    }
    return res.send(members);
  });
};

exports.getMember = function(req, res) {
  var dir = config.membersPath;
  var memberName = req.params.name;
  dirReader.getFileContents(dir, memberName + '.html', function (err, data) {
    if(err) { errorHandler.sendError(req, res, err); }
    res.set('Content-Type', 'text/html');
    return res.send(data.fileContent);
  });
};