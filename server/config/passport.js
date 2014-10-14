var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var Member = mongoose.model('Member');

module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      Member.findOne({username:username}).exec(function(err, member) {
        if(member && member.authenticate(password)) {
          return done(null, member);
        } else {
          return done(null, false);
        }
      });
    }
  ));

  passport.serializeUser(function(member, done) {
    if(member) {
      done(null, member._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    Member.findOne({_id:id}).exec(function(err, member) {
      if(member) {
        return done(null, member);
      } else {
        return done(null, false);
      }
    });
  });
};