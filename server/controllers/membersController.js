var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');
var cloudinary = require('cloudinary');
var config = require('../config/config');

exports.saveMember = function(req, res, next) {
  var memberData = toMemberData(req.body);

  // only current admins can create new members
  if (!req.user || !req.user.hasRole('admin')) {
    errorHandler.sendError(req, res, err, 403);
  }

  saveImg(req.files.img, memberData.name, function(err, result) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      if (result === undefined) {
        memberData.imgPath = '';
        memberData.imgId = null;
      } else {
        memberData.imgPath = result.url;
        memberData.imgId = result.public_id;
      }
      memberData.salt = encrypt.createSalt();
      memberData.hashedPwd = encrypt.hashPwd(memberData.salt, memberData.password);

      // create the member
      User.create(memberData, function (err, member) {
        if (err) { errorHandler.sendError(req, res, err); }
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
    }
  });
};

exports.updateMember = function(req, res) {
  var memberId = req.body._id;
  var memberData = toMemberData(req.body);

  // if not updating self or if this is an not admin member
  if(req.user._id.toString() !== memberId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  if(memberData.password && memberData.password.length > 0) {
    memberData.salt = encrypt.createSalt();
    memberData.hashedPwd = encrypt.hashPwd(memberData.salt, memberData.password);
  }

  User.findById(memberId, function(err, member) {
    if (member === undefined) { errorHandler.sendError(req, res, 'Member not found with id: ' + memberId); }
    else {
      // if there is an img to save then
      // save the image by overwriting the old image using the memberData.imageId parameter
      if (req.files.img) {
        //var imgName = member.name + (new Date()).getTime();
        var imgName = member.name;
        saveImg(req.files.file, imgName, function (err, result) {
          if (err) { errorHandler.sendError(req, res, err); }
          else {
            memberData.imgPath = result.url;
            memberData.imgId = result.public_id;
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
  User.find({}).select('name bio imgPath').exec(function (err, collection) {
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

exports.deleteMember = function(req, res) {
  // get the user object from the request body that is to be deleted
  var userDeleteId = req.params.id;

  // only admins can delete users
  if(!req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  // if there was no user object in the request then return bad request
  else if (userDeleteId === undefined) {
    res.status(400);
    return res.end();
  }
  // otherwise, get the user from the database then delete them
  else {
    User.findById(userDeleteId).exec(function(err, data) {
      if(err) { errorHandler.sendError(req, res, err, 404); }
      else {
        var userToDelete = data;
        userToDelete.remove(function(err) {
          if(err) { errorHandler.sendError(req, res, err); }
          return res.end();
        });
      }
    });
  }
};

function toMemberData(member) {
  var data = {};
  if (member.name) {
    data.name = member.name;
  }
  if (member.username) {
    data.username = member.username;
  }
  if (member.password) {
    data.password = member.password;
  }
  if (member.bio) {
    data.bio = member.bio;
  }
  if (member.imgPath) {
    data.imgPath = member.imgPath;
  }
  if (member.imgId) {
    data.imgId = member.imgId;
  }
  if (member.roles) {
    member.roles = JSON.parse(member.roles);
    data.roles = [];
    for (var i = 0; i < member.roles.length; i++) {
      data.roles[i] = member.roles[i];
    }
  }
  return data;
}

function updateMember(req, res, memberId, memberData) {
  User.findByIdAndUpdate(memberId, memberData, function(err, member) {
    if (err) { errorHandler.sendError(req, res, err); }
    else {
      if (req.user._id.toString() === memberId) {
        // if updating self then set self to the newly updated member object
        req.user = member;
      }
      res.send(member);
      res.end();
    }
  });
}

/**
 * Make a call to Cloudinary to store the image.
 * @param srcImgPath
 * @param imageId (optional if replacing an existing image)
 * @param callback
 */
function saveImg(srcImg, imageId, callback) {
  if (srcImg === undefined) {
    callback(null, undefined);
  }

  if (typeof(imageId) === 'function') {
    callback = imageId;
    imageId = null;
  }

  /**
   * Cloudinar returns the following object:
   *  {
   *   public_id: 'sample',
   *   version: 1312461204,
   *   width: 864,
   *   height: 576,
   *   format: 'jpg',
   *   bytes: 120253,
   *   url: 'http://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
   *   secure_url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg'
   * }
   */
  var options = {
    transformation: [
      {width: 350, crop: 'scale'}
    ]
  };
  if (imageId) {
    options.public_id = imageId;
  }

  cloudinary.uploader.upload(srcImg.path, function(result) {
    callback(null, result);
  }, options);
}