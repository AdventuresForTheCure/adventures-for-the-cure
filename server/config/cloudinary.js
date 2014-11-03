var cloudinary = require('cloudinary');

module.exports = function() {
  cloudinary.config({
    cloud_name: 'http-adventuresforthecure-com',
    api_key: '463837763866371',
    api_secret: 'uFJuS4sKa9z9u4nSWUHe2I9OMZE'
  });
}
