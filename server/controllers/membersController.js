var Member = require('mongoose').model('Member');
var errorHandler = require('../utilities/errorHandler');

exports.getMembers = function(req, res) {
  Member.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getMember = function(req, res) {
  var memberId = req.params.id;
  if (!memberId) { errorHandler.sendError(req, res, 'memberId is a required request parameter'); }
  else {
    Member.findOne({_id: memberId}).exec(function (err, user) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      res.send(user);
    });
  }
};

exports.saveMember = function (req, res, next) {
  var memberData = req.body;

  // only admins can create a new member
  if (!req.user.hasRole('admin')) {
    res.status(403);
    errorHandler.sendError(req, res, 'you do not have permission to create a new member');
  }
  else {
    Member.create(memberData, function (err, member) {
      if (err) { errorHandler.sendError(req, res, err); }
      else {
        emailer.sendAuditMessageEMail('Member: "' + memberData.username + '" was created by: ' + req.user.username);
        res.send(member);
      }
    });
  }
};

exports.updateMember = function (req, res) {
  var memberUpdates = req.body;
  var memberId = memberUpdates._id;
  delete memberUpdates._id;

  // users can only update their own member data
  // admins can update anyone's data
  if (memberData.username !== req.user.username || !req.user.hasRole('admin')) {
    res.status(403);
    errorHandler.sendError(req, res, 'you do not have permission to update this member');
  }

  Group.findByIdAndUpdate(memberId, memberUpdates, undefined, function (err) {
    if (err) { errorHandler.sendError(req, res, err); }
    else {
      memberUpdates._id = memberId;
      emailer.sendAuditMessageEMail('Member: "' + memberUpdates.username + '" was updated by: ' + req.user.username);
      res.send(memberUpdates);
    }
  });
};