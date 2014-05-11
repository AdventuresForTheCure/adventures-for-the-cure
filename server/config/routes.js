var auth = require('./auth'),
  cache = require('./cache');

module.exports = function(app, config) {
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