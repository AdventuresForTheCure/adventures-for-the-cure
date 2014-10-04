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

  // log the error
  console.error(err);

  // set the status to 400 if it was not explicitly set already
  status = (status) ? status : 400;

  // return the status
  res.status(status);

  // return the error
  res.send({reason: err.toString()});
};