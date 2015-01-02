var VolunteerEvent = require('mongoose').model('VolunteerEvent');
var errorHandler = require('../utilities/errorHandler');
var cloudinaryWrapper = require('../utilities/cloudinaryWrapper');

exports.saveVolunteerEvent = function(req, res) {
  var volunteerEventData = VolunteerEvent.toVolunteerEventData(req.body);

  if (!req.user || !req.user.hasRole('board')) {
    errorHandler.sendError(req, res, err, 403);
  }

  cloudinaryWrapper.saveImg(req.files.img, volunteerEventData.name, function(err, result) {
    if(err) { errorHandler.sendError(req, res, err); }
    else {
      if (!result) {
        volunteerEventData.imgPath = '';
      } else {
        volunteerEventData.imgPath = result.url;
      }

      // create the item
      VolunteerEvent.create(volunteerEventData, function (err, volunteerEvent) {
        if (err) {
          errorHandler.sendError(req, res, err);
        }
        res.send(volunteerEvent);
      });
    }
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
exports.getVolunteerEvent = function(req, res) {
  var volunteerEventId = req.params.id;
  if (!volunteerEventId) { errorHandler.sendError(req, res, 'volunteerEventId is a required request parameter'); }
  else {
    VolunteerEvent.findOne({_id: volunteerEventId}).exec(function (err, volunteerEvent) {
      if (err) {
        errorHandler.sendError(req, res, err);
      }
      res.send(volunteerEvent);
    });
  }
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