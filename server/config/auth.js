var passport = require('passport');

exports.login = function(req, res, next) {
  var auth = passport.authenticate('local', function(err, member) {
    if(err) {return next(err);}
    if(!member) { res.send({success:false});}
    req.logIn(member, function(err) {
      if(err) {return next(err);}
      res.send({success:true, member: member});
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
    if(!req.isAuthenticated() || req.member.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  };
};