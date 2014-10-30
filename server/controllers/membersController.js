var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');

exports.updateMember = function(req, res) {
  var memberUpdates = req.body;
  var memberId = memberUpdates._id;
  delete memberUpdates._id;

  // if not updating self or if this is an not admin member
  if(req.user.username !== memberUpdates.username && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  if(memberUpdates.password && memberUpdates.password.length > 0) {
    memberUpdates.salt = encrypt.createSalt();
    memberUpdates.hashedPwd = encrypt.hashPwd(memberUpdates.salt, memberUpdates.password);
  }
  User.findByIdAndUpdate(memberId, memberUpdates, undefined, function(err) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      if (req.user._id === memberId) {
        // if updating self then set self to the newly updated member object
        req.user = memberUpdates;
      }
      memberUpdates._id = memberId;
      res.send(memberUpdates);
    }
  });
}

exports.getMembers = function(req, res) {
  User.find({}).select('name bio img username').exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getMembersAsAdmin = function(req, res) {
  User.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getMember = function(req, res) {
  var memberId = req.params.id;
  if (!memberId) { errorHandler.sendError(req, res, 'memberId is a required request parameter'); }
  else {
    User.findOne({_id: memberId}).exec(function (err, member) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      res.send(member);
    });
  }
};