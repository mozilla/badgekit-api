var Issuer = require('../models/issuer');

exports = module.exports = function applyIssuerRoutes (server) {

  server.get('/issuers', function (req, res, next) {
    res.send({issuers:[]});
    return next();
  });

  server.get('/issuers/:issuerId', function (req, res, next) {
    res.send(req.params);
    return next();
  });

};
