var mongoose = require('mongoose');
var encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  name: {
    type:String,
    required:'{PATH} is required!'},
  username: {
    type: String,
    required: '{PATH} is required!',
    unique:true},
  salt: {
    type:String,
    required:'{PATH} is required!'},
  hashedPwd: {
    type:String,
    required:'{PATH} is required!'},
  bio: {
    type: String,
    default: ''
  },
  imgPath: {
    type: String,
    default: ''
  },
  imgPathTmp: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
  roles: [String]
});

userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
  },
  hasRole: function(role) {
    return this.roles && this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);
User.toMemberData = function(member) {
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
  if (member.imgPathTmp) {
    data.imgPathTmp = member.imgPathTmp;
  }
  if (member.roles) {
    var roles = JSON.parse(member.roles);
    data.roles = [];
    for (var i = 0; i < roles.length; i++) {
      data.roles[i] = roles[i];
    }
  }
  return data;
}

function createDefaultUsers() {
  User.find({}).exec(function(err, collection) {
    if(collection.length < 2) {
      console.log('creating default users');
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'p');
      User.create({name:'Patrick Blair',username:'pblair12@gmail.com', salt: salt, hashedPwd: hash,
        bio: 'AFC Founder', img: '/img/Patrick Blair.jpg',
        roles: ['admin', 'inventory']});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'm');
      User.create({name:'Mike Caputi',username:'mcaput1@gmail.com', salt: salt, hashedPwd: hash,
        bio: 'AFC Tresurer', img: '/img/Mike Caputi.jpg',
        roles: ['admin', 'inventory']});
    } else {
      console.log('not creating default users because %s users already exist', collection.length);
    }
  });
}

exports.createDefaultUsers = createDefaultUsers;