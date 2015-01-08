var passport = require('passport');
var emailer = require('../utilities/emailer');

exports.login = function(req, res, next) {
  var auth = passport.authenticate('local', function(err, member) {
    if(err) {return next(err);}
    if(!member) { res.send({success:false});}
    req.logIn(member, function(err) {
      if(err) {return next(err);}
      else {
        emailer.sendAuditMessageEMail(member.prettyName() + ' logged in');
        res.send({success: true, member: member});
      }
    });
  });
  auth(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.end();
};

exports.requiresLoggedIn = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresLoggedInRole = function(role) {
  return function(req, res, next) {
    if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  };
};