var mongoose = require('mongoose');

var memberSchema = mongoose.Schema({
  memberName: {
    type: String,
    required: '{PATH} is required'},
  memberBio: {
    type: String,
    required: '{PATH} is required'},
  username: {
    type: String,
    required: '{PATH} is required'}
});
var Member = mongoose.model('Member', memberSchema);