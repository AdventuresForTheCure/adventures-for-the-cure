var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');

exports.getMembers = function(req, res) {
  User.find({}).select('name bio img').exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getMember = function(req, res) {
  var userId = req.params.id;
  if (!userId) { errorHandler.sendError(req, res, 'userId is a required request parameter'); }
  else {
    User.findOne({_id: userId}).exec(function (err, user) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      res.send(user);
    });
  }
};