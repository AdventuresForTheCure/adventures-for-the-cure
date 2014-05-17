var auth = require('./auth'),
  cache = require('./cache'),
  path = require('path');

module.exports = function(app, config) {
  // static html files are in this directory
  app.get('/partials/campaigns/campaigns/*', function(req, res) {
    res.sendfile(path.resolve('public/app/views/campaigns/campaigns/' + req.params));
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