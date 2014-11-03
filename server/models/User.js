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
  imgId: {
    type: String,
    default: null
  },
  roles: [String]
});

userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);

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