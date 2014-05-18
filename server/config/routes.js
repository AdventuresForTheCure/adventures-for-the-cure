var auth = require('./auth'),
  cache = require('./cache'),
  campaigns = require('../controllers/campaignsController');

module.exports = function(app, rootPath) {
  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  // static html files are in this directory
  app.get('/partials/campaigns/campaigns/*', function(req, res) {
    res.sendfile(rootPath + 'public/app/views/campaigns/campaigns/' + req.params);
  });
  // render jade files
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
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