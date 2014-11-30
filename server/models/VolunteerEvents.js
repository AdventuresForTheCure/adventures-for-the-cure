var mongoose = require('mongoose');

var volunteerEventSchema = mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required!'
  },
  date: {
    type: Date,
    required: '{PATH} is required!'
  },
  isAfcEvent: {
    type: Boolean,
    default: true
  },
  imgPath: {
    type: String,
    default: ''
  },
  imgPathTmp: {
    type: String,
    default: ''
  }
});

var VolunteerEvent = mongoose.model('VolunteerEvent', volunteerEventSchema);
VolunteerEvent.toVolunteerEventData = function(volunteerEvent) {
  var data = {};
  data.name = volunteerEvent.name;
  data.date = volunteerEvent.date;
  data.isAfcEvent = volunteerEvent.isAfcEvent
  if (volunteerEvent.imgPath) {
    data.imgPath = volunteerEvent.imgPath;
  }
  if (volunteerEvent.imgPathTmp) {
    data.imgPathTmp = volunteerEvent.imgPathTmp;
  }
  return data;
}

function createDefaultVolunteerEvents() {
  VolunteerEvent.find({}).exec(function(err, collection) {
    if (collection.length < 2) {
      console.log('creating default volunteer events');
      VolunteerEvent.create({
        name: 'Sugar Hill',
        date: new Date(),
        isAfcEvent: true
      });
      VolunteerEvent.create({
        name: 'Patapsco 100',
        date: new Date(),
        isAfcEvent: true
      });
      VolunteerEvent.create({
        name: 'Rockburn Cross',
        date: new Date(),
        isAfcEvent: true
      });
    }
  });
}

exports.createDefaultVolunteerEvents = createDefaultVolunteerEvents;