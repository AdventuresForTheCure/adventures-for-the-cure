var auth = require('./auth'),
  cache = require('./cache'),
  campaigns = require('../controllers/campaignsController'),
  members = require('../controllers/membersController'),
  inventoryItems = require('../controllers/inventoryItemsController');

module.exports = function(app, config) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.get('/api/members/:name', cache.disableBrowserCache, members.getMember);
  app.get('/api/members', cache.disableBrowserCache, members.getMembers);

  app.get('/api/inventoryItems', cache.disableBrowserCache, inventoryItems.getInventoryItems);

  // static html files for the campaigns are in this directory
  app.get('/partials/campaigns/campaigns/*', function(req, res) {
    res.sendfile(config.rootPath + 'public/app/views/campaigns/campaigns/' + req.params[0]);
  });

  // static html files for the member profiles are in this directory
  app.get('/partials/members/members/*', function(req, res) {
    res.sendfile(config.rootPath + 'public/app/views/members/members/' + req.params[0]);
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
}