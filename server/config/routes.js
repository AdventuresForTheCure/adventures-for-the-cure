var auth = require('./auth');
var cache = require('./cache');
var campaigns = require('../controllers/campaignsController');
var sponsorLogos = require('../controllers/sponsorLogosController');
var jerseyImages = require('../controllers/jerseyImagesController');
var videos = require('../controllers/videosController');
var members = require('../controllers/membersController');
var inventoryItems = require('../controllers/inventoryItemsController');
var inventoryItemsXero = require('../controllers/inventoryItemsXeroController');
var volunteerEvents = require('../controllers/volunteerEventsController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app, config) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.get('/api/sponsorLogos', cache.disableBrowserCache, sponsorLogos.getSponsorLogos);

  app.get('/api/jerseyImages', cache.disableBrowserCache, jerseyImages.getJerseyImages);

  app.get('/api/videos/:name', cache.disableBrowserCache, videos.getVideo);
  app.get('/api/videos', cache.disableBrowserCache, videos.getVideos);

  app.get('/api/members', cache.disableBrowserCache, members.getMembers);
  app.get('/api/members/active', cache.disableBrowserCache, members.getActiveMembers);
  app.get('/api/members/:id', cache.disableBrowserCache, members.getMember);
  app.post('/api/members/:id', multipartMiddleware, members.updateMember);
  app.post('/api/members/tmpImg/:id', multipartMiddleware, members.updateMemberTmpImg);
  app.post('/api/members', multipartMiddleware, members.saveMember);
  // app.delete('/api/members/:id', auth.requiresLoggedInRole('admin'), members.deleteMember);
  // app.get('/api/member/activate/:id', auth.requiresLoggedInRole('admin'), members.activateMember);
  // app.get('/api/member/deactivate/:id', auth.requiresLoggedInRole('admin'), members.deactivateMember);

  app.get('/api/xero/inventoryItems', cache.disableBrowserCache, inventoryItemsXero.getInventoryItems);

  app.get('/api/inventoryItems', cache.disableBrowserCache, inventoryItems.getInventoryItems);
  // app.post('/api/inventoryItems', auth.requiresLoggedInRole('inventory'), multipartMiddleware, inventoryItems.saveInventoryItem);
  // app.post('/api/inventoryItems/:id', auth.requiresLoggedInRole('inventory'), multipartMiddleware, inventoryItems.updateInventoryItem);
  // app.delete('/api/inventoryItems/:id', auth.requiresLoggedInRole('inventory'), inventoryItems.deleteInventoryItem);
  app.post('/api/inventoryItems/img/:id', multipartMiddleware, inventoryItems.updateInventoryItemImg);

  app.get('/api/volunteerEvents', cache.disableBrowserCache, volunteerEvents.getVolunteerEvents);
  app.get('/api/volunteerEvents/:id', cache.disableBrowserCache, volunteerEvents.getVolunteerEvent);
  // app.post('/api/volunteerEvents', auth.requiresLoggedInRole('board'), multipartMiddleware, volunteerEvents.saveVolunteerEvent);
  // app.post('/api/volunteerEvents/:id', auth.requiresLoggedInRole('board'), multipartMiddleware, volunteerEvents.updateVolunteerEvent);
  // app.delete('/api/volunteerEvents/:id', auth.requiresLoggedInRole('board'), volunteerEvents.deleteVolunteerEvent);

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