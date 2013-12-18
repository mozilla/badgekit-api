var applyBadgeRoutes = require('./badges');
var applyIssuerRoutes = require('./issuers');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', function (req, res, next) {
    res.send('OpenBadger');
    return next();
  });

  applyBadgeRoutes(server);
  applyIssuerRoutes(server);

};
