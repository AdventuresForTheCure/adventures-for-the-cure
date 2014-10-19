var auth = require('./auth'),
  cache = require('./cache'),
  campaigns = require('../controllers/campaignsController'),
  videos = require('../controllers/videosController'),
  users = require('../controllers/usersController'),
  members = require('../controllers/membersController'),
  inventoryItems = require('../controllers/inventoryItemsController');

module.exports = function(app, config) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.get('/api/videos/:name', cache.disableBrowserCache, videos.getVideo);
  app.get('/api/videos', cache.disableBrowserCache, videos.getVideos);

  app.get('/api/members', cache.disableBrowserCache, members.getMembers);

  app.get('/api/users', auth.requiresLoggedInRole('admin'),cache.disableBrowserCache, users.getUsers);
  app.post('/api/users', auth.requiresLoggedInRole('admin'), users.saveUser);
  app.get('/api/users/:id', auth.requiresLoggedInRole('admin'), users.getUser);

  app.get('/api/inventoryItems', cache.disableBrowserCache, inventoryItems.getInventoryItems);

  app.get('/dist/*.js', function(req, res) {
    res.sendfile(config.rootPath + '/dist/' + req.params[0] + '.js');
  });

  // static html files for the campaigns are in this directory
  app.get('/partials/campaigns/campaigns/*', function(req, res) {
    res.sendfile(config.rootPath + 'public/app/views/campaigns/campaigns/' + req.params[0]);
  });

  // static html files for the user profiles are in this directory
  app.get('/partials/users/users/*', function(req, res) {
    res.sendfile(config.rootPath + 'public/app/views/users/users/' + req.params[0]);
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