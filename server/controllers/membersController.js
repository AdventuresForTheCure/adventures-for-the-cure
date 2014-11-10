var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');
var cloudinary = require('cloudinary');
var config = require('../config/config');

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

exports.saveMember = function(req, res, next) {
  var memberData = req.body;

  // save the image to the file system
  memberData.imgPath = config.rootPath + 'public/img/members/' + memberData.name + '.png'
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

      // only current admins can create new members
      if (!req.user || !req.user.hasRole('admin')) {
        errorHandler.sendError(req, res, err, 403);
      }

      // create the member
      User.create(memberData, function (err, member) {
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
  // save the image by overwriting the old image using the memberData.imageId parameter
  saveImg(req.files.img, memberData.name, function(err, result) {
    if (err) {
      errorHandler.sendError(req, res, err);
    }
    else {
      User.findByIdAndUpdate(memberId, memberData, function (err, member) {
        if (err) {
          errorHandler.sendError(req, res, err);
        }
        else {
          if (req.user._id === memberId) {
            // if updating self then set self to the newly updated member object
            req.user = member;
          }
          res.send(member);
        }
      });
    }
  });
}

exports.updateMemberBio = function(req, res) {
  var memberId = req.params.id;
  var memberBio = req.body.bio;

  // if not updating self or if this is an not admin member
  if(req.user._id.toString() !== memberId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  User.findById(memberId, function(err, member) {
    if (member === undefined) { errorHandler.sendError(req, res, 'Member not found with id: ' + memberId); }
    else {
      member.update({bio: memberBio}, function (err) {
        if (err) {
          errorHandler.sendError(req, res, err);
        }
        else {
          if (req.user._id === memberId) {
            // if updating self then set self to the newly updated member object
            req.user = member;
          }
          res.send(member);
          res.end();
        }
      });
    }
  });
}

exports.updateMemberImg = function(req, res) {
  var memberId = req.params.id;

  // if not updating self or if this is an not admin member
  if(req.user._id.toString() !== memberId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  User.findById(memberId, function(err, member) {
    if (member === undefined) { errorHandler.sendError(req, res, 'Member not found with id: ' + memberId); }
    else {
      var date = new Date();
      var imgName = member.name + date.getTime();
      saveImg(req.files.file, imgName, function (err, result) {
        if (err) {
          errorHandler.sendError(req, res, err);
        }
        else {
          member.update({imgPath: result.url, imgId: result.public_id}, function (err) {
            if (err) { errorHandler.sendError(req, res, err);}
            else {
              member.imgPath = result.url;
              member.imgId = result.public_id;
              if (req.user._id === memberId) {
                // if updating self then set self to the newly updated member object
                req.user = member;
              }
              res.send(member);
              res.end();
            }
          });
        }
      });
    }
  });
}

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
  var data = {
    name: member.name,
    username: member.username,
    salt: member.salt,
    hashedPwd: member.hashedPwd,
    bio: member.bio,
    imgPath: member.imgPath,
    imgId: member.imgId,
    roles: []
  };

  for (var i = 0; i < member.roles.length; i++) {
    data.roles[i] = member.roles[i];
  }
  return data;
}