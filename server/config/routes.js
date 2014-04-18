var cache = require('./cache');

module.exports = function(app, config) {
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  // ensure that the client side application does ALL of the routing
  app.get('*', function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
}