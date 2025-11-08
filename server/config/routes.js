var cache = require('./cache');
var campaigns = require('../controllers/campaignsController');
var sponsorLogos = require('../controllers/sponsorLogosController');
var jerseyImages = require('../controllers/jerseyImagesController');
var videos = require('../controllers/videosController');

module.exports = function(app, config) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.get('/api/sponsorLogos', cache.disableBrowserCache, sponsorLogos.getSponsorLogos);

  app.get('/api/jerseyImages', cache.disableBrowserCache, jerseyImages.getJerseyImages);

  app.get('/api/videos/:name', cache.disableBrowserCache, videos.getVideo);
  app.get('/api/videos', cache.disableBrowserCache, videos.getVideos);

  // render jade files
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params[0]);
  });

  // app.post('/login', auth.login);
  //
  // app.post('/logout', auth.logout);

  app.get('/robots.txt', function(req, res) {
    res.render('robots');
  });

  // ensure that the client side application does ALL of the routing
  app.get('*', function(req, res) {
    var bootstrappedConfig = {
      port: config.port,
      sslport: config.sslport
    };
    res.render('index', {
      bootstrappedConfig: bootstrappedConfig
    });
  });
};