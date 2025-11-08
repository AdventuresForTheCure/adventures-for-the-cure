var htmlUtils = require('../utilities/htmlUtils');

/**
 * Return an error response to a server request
 *
 * @param req, the request
 * @param res, the response
 * @param err, OPTIONAL - the Error object, or a string that will be used to create the message of an Error object
 * @param status, OPTIONAL - the response status, defaults to 400 if not set
 */
exports.sendError = function(req, res, err, status) {
  // create an error if one was not passed in
  if (!err) {
    err = new Error('An error occurred');
  } else if (typeof(err) === 'string') {
    err = new Error(err);
  }

  var errMsg = err.toString();
  // get the error as a string and add the user who generated the error
  if (req.user) {
    errMsg = 'Error: ' + req.user.prettyName() + ': ' + errMsg;
  } else {
    errMsg = 'Error: ' + errMsg;
  }

  // log the error
  console.error(errMsg);

  // set the status to 400 if it was not explicitly set already
  status = (status) ? status : 400;

  // return the status
  res.status(status);

  // return the error
  res.send({reason: htmlUtils.encode(errMsg)});
};