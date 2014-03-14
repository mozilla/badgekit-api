var applyBadgeRoutes = require('./badges');
var applySystemRoutes = require('./systems');
var applyIssuerRoutes = require('./issuers');
var applyProgramRoutes = require('./programs');
var applyBadgeInstanceRoutes = require('./badge-instances');
var applyImageRoutes = require('./images');
var applyClaimCodesRoutes = require('./claim-codes');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', function (req, res, next) {
    res.send('OpenBadger');
    return next();
  });

  [ applyBadgeRoutes,
    applySystemRoutes,
    applyIssuerRoutes,
    applyProgramRoutes,
    applyBadgeInstanceRoutes,
    applyImageRoutes,
    applyClaimCodesRoutes,
  ].forEach(callWith(server));

};

function callWith(_) {
  const args = arguments
  return function (fn) {
    return fn.apply(null, args)
  }
}
