var mongoose = require('mongoose');

var memberSchema = mongoose.Schema({
  firstName: {
    type:String,
    required:'{PATH} is required!'},
  lastName: {
    type:String,
    required:'{PATH} is required!'},
  username: {
    type: String,
    required: '{PATH} is required'},
  salt: {
    type:String,
    required:'{PATH} is required!'},
  hashedPwd: {
    type:String,
    required:'{PATH} is required!'},
  roles: [
    String
  ],
  memberBio: {
    type: String
  }
});

memberSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};

var Member = mongoose.model('Member', memberSchema);