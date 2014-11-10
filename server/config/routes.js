var auth = require('./auth');
var cache = require('./cache');
var campaigns = require('../controllers/campaignsController');
var videos = require('../controllers/videosController');
var members = require('../controllers/membersController');
var inventoryItems = require('../controllers/inventoryItemsController');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app, config) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.get('/api/videos/:name', cache.disableBrowserCache, videos.getVideo);
  app.get('/api/videos', cache.disableBrowserCache, videos.getVideos);

  app.get('/api/members', cache.disableBrowserCache, members.getMembers);
  app.get('/api/membersAsAdmin',  auth.requiresLoggedInRole('admin'), cache.disableBrowserCache, members.getMembersAsAdmin);
  app.post('/api/members/:id', multipartMiddleware, members.updateMember);
  app.post('/api/members', multipartMiddleware, members.saveMember);
  app.post('/api/members/bio/:id', members.updateMemberBio);
  app.post('/api/members/img/:id', multipartMiddleware, members.updateMemberImg);
  app.get('/api/members/:id', auth.requiresLoggedInRole('admin'), members.getMember);
  app.delete('/api/members/:id', auth.requiresLoggedInRole('admin'), members.deleteMember);

  app.get('/api/inventoryItems', cache.disableBrowserCache, inventoryItems.getInventoryItems);

  app.get('/dist/*.js', function(req, res) {
    res.sendFile(config.rootPath + '/dist/' + req.params[0] + '.js');
  });

  // static html files for the campaigns are in this directory
  app.get('/partials/campaigns/campaigns/*', function(req, res) {
    res.sendFile(config.rootPath + 'public/app/views/campaigns/campaigns/' + req.params[0]);
  });

  // render jade files
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params[0]);
  });

  app.post('/login', auth.login);

  app.post('/logout', auth.logout);

  // ensure that the client side application does ALL of the routing
  app.get('*', function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};