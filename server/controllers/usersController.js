var User = require('mongoose').model('User');
var errorHandler = require('../utilities/errorHandler');
var encrypt = require('../utilities/encryption');

exports.getUsers = function(req, res) {
  User.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.getUser = function(req, res) {
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

exports.saveUser = function(req, res, next) {
  var userData = req.body;
  userData.salt = encrypt.createSalt();
  userData.hashedPwd = encrypt.hashPwd(userData.salt, userData.password);

  // only current admins can create new users
  if (!req.user || !req.user.hasRole('admin')) {
    errorHandler.sendError(req, res, err, 403);
  }

  // create the user
  User.create(userData, function(err, user) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      // if this request to create a user was not made by a current user then log the new user in
      if (!req.user) {
        req.user = user;
        next();
      }
      // otherwise keep the current user logged in and return success
      else {
        res.send(user);
      }
    }
  })
};

exports.updateUser = function (req, res) {
  var userUpdates = req.body;
  var userId = userUpdates._id;
  delete userUpdates._id;

  // if not updating self or if this is an not admin user
  if(req.user._id != userId && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }
  if(userUpdates.password && userUpdates.password.length > 0) {
    userUpdates.salt = encrypt.createSalt();
    userUpdates.hashedPwd = encrypt.hashPwd(userUpdates.salt, userUpdates.password);
  }
  User.findByIdAndUpdate(userId, userUpdates, undefined, function(err) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      if (req.user._id === userId) {
        // if updating self then set self to the newly updated user object
        req.user = userUpdates;
      }
      userUpdates._id = userId;
      res.send(userUpdates);
    }
  });
};