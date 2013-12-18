var applyBadgeRoutes = require('./badges');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', function (req, res, next) {
    res.send('OpenBadger');
    return next();
  });

  applyBadgeRoutes(server);

};
