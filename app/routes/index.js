const package = require('../../package')
const applyBadgeRoutes = require('./badges');
const applySystemRoutes = require('./systems');
const applyIssuerRoutes = require('./issuers');
const applyProgramRoutes = require('./programs');
const applyBadgeInstanceRoutes = require('./badge-instances');
const applyImageRoutes = require('./images');
const applyClaimCodesRoutes = require('./claim-codes');
const applyApplicationRoutes = require('./applications');
const applyReviewRoutes = require('./reviews');

exports = module.exports = function applyAllRoutes (server) {

  server.get('/', health);
  server.get('/healthcheck', health)

  function health(req, res, next) {
    res.send({
      app: 'BadgeKit API',
      version: package.version,
    });
    return next();
  }


  [ applyBadgeRoutes,
    applySystemRoutes,
    applyIssuerRoutes,
    applyProgramRoutes,
    applyBadgeInstanceRoutes,
    applyImageRoutes,
    applyClaimCodesRoutes,
    applyApplicationRoutes,
    applyReviewRoutes,
  ].forEach(callWith(server));

};

function callWith(_) {
  const args = arguments
  return function (fn) {
    return fn.apply(null, args)
  }
}
