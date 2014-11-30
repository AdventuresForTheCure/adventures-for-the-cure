var cloudinary = require('cloudinary');

/**
 * Make a call to Cloudinary to store the image.
 * @param srcImgPath
 * @param imageId (optional if replacing an existing image)
 * @param callback
 */
exports.saveImg = function(srcImg, imageId, callback) {
  if (!srcImg) {
    callback(null, undefined);
  }

  if (typeof(imageId) === 'function') {
    callback = imageId;
    imageId = null;
  }

  /**
   * Cloudinar returns the following object:
   *  {
   *   public_id: 'sample',
   *   version: 1312461204,
   *   width: 864,
   *   height: 576,
   *   format: 'jpg',
   *   bytes: 120253,
   *   url: 'http://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
   *   secure_url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg'
   * }
   */
  var options = {
    transformation: [
      {width: 350, crop: 'scale'}
    ]
  };
  if (imageId) {
    options.public_id = imageId;
  }

  cloudinary.uploader.upload(srcImg.path, function (result) {
    callback(null, result);
  }, options);
};