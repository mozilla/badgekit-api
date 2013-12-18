const Issuer = require('../models/issuer');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/issuers', function (req, res, next) {
    Issuer.get({}, function (error, issuers) {
      if (error) return next(error)
      res.send({issuers:[]});
      return next();
    })
  });

  server.get('/issuers/:issuerId', function (req, res, next) {
    res.send(req.params);
    return next();
  });

};
