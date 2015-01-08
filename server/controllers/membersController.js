var Member = require('mongoose').model('Member');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');
var cloudinaryWrapper = require('../utilities/cloudinaryWrapper');
var config = require('../config/config');
var emailer = require('../utilities/emailer');

exports.saveMember = function(req, res, next) {
  var memberData = Member.toMemberData(req.body);

  // only current admins can create new members
  if (!req.user || !req.user.hasRole('admin')) {
    errorHandler.sendError(req, res, err, 403);
  }

  // if there is an image then save it first
  if (req.files.img) {
    cloudinaryWrapper.saveImg(req.files.img, memberData.name, function (err, result) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      else {
        if (!result) {
          memberData.imgPath = '';
        } else {
          memberData.imgPath = result.url;
        }
        // save member data
        saveMemberData(req, res, memberData);
      }
    });
  }
  // save member data
  else {
    saveMemberData(req, res, memberData);
  }
};

function saveMemberData(req, res, memberData) {
  memberData.salt = encrypt.createSalt();
  memberData.hashedPwd = encrypt.hashPwd(memberData.salt, memberData.password);

  // create the member
  Member.create(memberData, function (err, member) {
    if (err) {
      errorHandler.sendError(req, res, err);
    }
    else {
      // if this request to create a member was not made by a current member then log the new member in
      if (!req.user) {
        req.user = member;
        next();
      }
      // otherwise keep the current member logged in and return success
      else {
        res.send(member);
      }
    }
  });
};

exports.updateMember = function(req, res) {
  var memberId = req.params.id;;
  var memberData = Member.toMemberData(req.body);

  // if not updating self or if this is an not admin member
  if(req.user._id.toString() !== memberId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  if(memberData.password && memberData.password.length > 0) {
    memberData.salt = encrypt.createSalt();
    memberData.hashedPwd = encrypt.hashPwd(memberData.salt, memberData.password);
  }

  Member.findById(memberId, function(err, member) {
    if (!member) { errorHandler.sendError(req, res, 'Member not found with id: ' + memberId); }
    else {
      // if there is an img to save then
      // save the image by overwriting the old image using the memberData.imageId parameter
      if (req.files.img) {
        //var imgName = member.name + (new Date()).getTime();
        var imgName = member.name;
        cloudinaryWrapper.saveImg(req.files.img, imgName, function (err, result) {
          if (err) { errorHandler.sendError(req, res, err); }
          else {
            memberData.imgPath = result.url;
            updateMember(req, res, memberId, memberData);
          }
        });
      }
      // otherwise save the member data
      else {
        updateMember(req, res, memberId, memberData);
      }
    }
  });
};

exports.updateMemberTmpImg = function(req, res) {
  var memberId = req.params.id;

  // if not updating self or if this is an not admin member
  if(req.user._id.toString() !== memberId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  Member.findById(memberId, function(err, member) {
    if (!member) { errorHandler.sendError(req, res, 'Member not found with id: ' + memberId); }
    else {
      var memberData = {};
      // if there is an img to save then
      // save the image by overwriting the old image using the memberData.imageId parameter
      if (req.files.file) {
        //var imgName = member.name + (new Date()).getTime();
        var imgName = "tmp " + member.name;
        cloudinaryWrapper.saveImg(req.files.file, imgName, function (err, result) {
          if (err) { errorHandler.sendError(req, res, err); }
          else {
            memberData.imgPathTmp = result.url;
            updateMember(req, res, memberId, memberData);
          }
        });
      }
      // otherwise save the member data
      else {
        updateMember(req, res, memberId, memberData);
      }
    }
  });
};

exports.getMembers = function(req, res) {
  Member.find({}).sort({name: 1}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getMember = function(req, res) {
  var memberId = req.params.id;
  if (!memberId) { errorHandler.sendError(req, res, 'memberId is a required request parameter'); }
  else {
    Member.findOne({_id: memberId}).exec(function (err, member) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      res.send(member);
    });
  }
};

exports.deleteMember = function(req, res) {
  // get the member object from the request body that is to be deleted
  var memberId = req.params.id;

  // only admins can delete members
  if(!req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  // if there was no member object in the request then return bad request
  else if (!memberId) {
    res.status(400);
    return res.end();
  }
  // otherwise, get the member from the database then delete them
  else {
    Member.findById(memberId).exec(function(err, data) {
      if(err) { errorHandler.sendError(req, res, err, 404); }
      else {
        var member = data;
        member.remove(function(err) {
          if(err) { errorHandler.sendError(req, res, err); }
          return res.end();
        });
      }
    });
  }
};

function updateMember(req, res, memberId, memberData) {
  Member.findByIdAndUpdate(memberId, memberData, function(err, member) {
    if (err) { errorHandler.sendError(req, res, err); }
    else {
      if (req.user._id.toString() === memberId) {
        emailer.sendAuditMessageEMail(req.user.prettyName() + ' updated their profile');
        // if updating self then set self to the newly updated member object
        req.user = member;
      } else {
        emailer.sendAuditMessageEMail(member.prettyName() + ' was updated by ' + req.user.prettyName());
      }
      res.send(member);
    }
  });
};