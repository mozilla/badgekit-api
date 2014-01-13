var applyBadgeRoutes = require('./badges');
var applyIssuerRoutes = require('./issuers');
var applyProgramRoutes = require('./programs');
var applyImageRoutes = require('./images');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', function (req, res, next) {
    res.send('OpenBadger');
    return next();
  });

  applyBadgeRoutes(server);
  applyIssuerRoutes(server);
  applyProgramRoutes(server);
  applyImageRoutes(server);

};
