var VolunteerEvent = require('mongoose').model('VolunteerEvent');
var errorHandler = require('../utilities/errorHandler');

exports.saveVolunteerEvent = function(req, res) {
  var volunteerEventData = toVolunteerEventData(req.user, req.body);

  if (!req.user || !req.user.hasRole('board')) {
    errorHandler.sendError(req, res, err, 403);
  }

  // create the item
  VolunteerEvent.create(volunteerEventData, function (err, volunteerEvent) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(volunteerEvent);
  });
};

exports.updateVolunteerEvent = function(req, res) {
  var volunteerEventId = req.params.id;
  var volunteerEventData = VolunteerEvent.toVolunteerEventData(req.body);

  if(!req.user.hasRole('board')) {
    res.status(403);
    return res.end();
  }

  VolunteerEvent.findByIdAndUpdate(volunteerEventId, volunteerEventData, function(err, volunteerEvent) {
    if (err) { errorHandler.sendError(req, res, err); }
    res.send(volunteerEvent);
  });
};

exports.getVolunteerEvents = function (req, res) {
  VolunteerEvent.find({}).exec(function (err, collection) {
    if (err) { errorHandler.sendError(req, res, err);}
    res.send(collection);
  });
};

exports.deleteVolunteerEvent = function(req, res) {
  var volunteerEventId = req.params.id;

  if(!req.user.hasRole('board')) {
    res.status(403);
    return res.end();
  }
  else if (!volunteerEventId) {
    res.status(400);
    return res.end();
  }
  else {
    VolunteerEvent.findById(volunteerEventId).exec(function(err, data) {
      if(err) { errorHandler.sendError(req, res, err, 404); }
      else {
        var volunteerEvent = data;
        volunteerEvent.remove(function(err) {
          if(err) { errorHandler.sendError(req, res, err); }
          return res.end();
        });
      }
    });
  }
};