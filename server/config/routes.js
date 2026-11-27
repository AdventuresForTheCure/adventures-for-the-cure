var fs = require('fs');
var path = require('path');
var campaigns = require('../controllers/campaignsController');
var site = require('../controllers/siteController');
var cache = require('./cache');

module.exports = function(app, config) {
  app.get('/api/health', function(req, res) {
    res.json({status: 'ok'});
  });

  app.get('/api/campaigns/:name', cache.disableBrowserCache, campaigns.getCampaign);
  app.get('/api/campaigns', cache.disableBrowserCache, campaigns.getCampaigns);

  app.use('/api', function(req, res) {
    res.status(404).json({reason: 'API endpoint not found'});
  });

  app.get('/sitemap.xml', site.getSitemap);
  app.get('/home', function(req, res) { res.redirect(301, '/'); });
  app.get(['/', '/join', '/events', '/rides', '/contact', '/campaigns', '/campaigns/:slug'], site.renderPage);

  var builtIndex = path.join(config.distPath, 'index.html');
  var appIndex = fs.existsSync(builtIndex) ? builtIndex : path.join(config.rootPath, 'index.html');
  app.use(function(req, res, next) {
    if (req.method !== 'GET' || path.extname(req.path) || !req.accepts('html')) return next();
    res.sendFile(appIndex, function(error) {
      if (error) next(error);
    });
  });

  app.use(function(req, res) {
    res.status(404).type('text').send('Not found');
  });

  app.use(function(error, req, res, next) {
    if (res.headersSent) return next(error);
    var status = Number(error.status) || 500;
    if (status >= 500) console.error(error);
    res.status(status).json({reason: status === 404 ? 'Content not found' : 'An internal error occurred'});
  });
};
