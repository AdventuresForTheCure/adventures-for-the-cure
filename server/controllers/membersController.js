var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');
var cloudinary = require('cloudinary');
var config = require('../config/config');

/**
 * Make a call to Cloudinary to store the image.
 * @param srcImgPath
 * @param callback
 */
function saveImg(srcImgPath, callback) {
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
  cloudinary.uploader.upload(srcImgPath, function(result) {
    callback(null, result);
  }, {
    transformation: [
      {width: 350, crop: 'scale'}
    ]
  });
}

exports.saveMember = function(req, res, next) {
  var memberData = req.body;

  // save the image to the file system
  memberData.imgPath = config.rootPath + 'public/img/members/' + memberData.name + '.png'
  saveImg(req.files.img.path, function(err, result) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      memberData.imgPath = result.url;
      memberData.imgId = result.public_id;
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