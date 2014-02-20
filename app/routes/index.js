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

  [ applyBadgeRoutes,
    applySystemRoutes,
    applyIssuerRoutes,
    applyProgramRoutes,
    applyImageRoutes,
    applyRelationshipRoutes,
  ].forEach(callWith(server));

};

function callWith(_) {
  const args = arguments
  return function (fn) {
    return fn.apply(null, args)
  }
}
