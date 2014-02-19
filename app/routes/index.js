var applyBadgeRoutes = require('./badges');
var applySystemRoutes = require('./systems');
var applyIssuerRoutes = require('./issuers');
var applyProgramRoutes = require('./programs');
var applyImageRoutes = require('./images');
var applyRelationshipRoutes = require('./relationships');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', function (req, res, next) {
    res.send('OpenBadger');
    return next();
  });

  applyBadgeRoutes(server);
  applySystemRoutes(server);
  applyIssuerRoutes(server);
  applyProgramRoutes(server);
  applyImageRoutes(server);
  applyRelationshipRoutes(server);

};
