var Badge = require('../models/badge');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/badges', function (req, res, next) {
    res.send({badges:[]});
    return next();
  });

  server.get('/badges/:badgeId', function (req, res, next) {
    res.send(req.params);
    return next();
  });

};
