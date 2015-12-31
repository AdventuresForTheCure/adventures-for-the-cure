var mongoose = require('mongoose');

var settingsSchema = mongoose.Schema({
  showActiveMembersOnly: {
    type: Boolean,
    default: false
  }
});

var Settings = mongoose.model('Settings', settingsSchema);