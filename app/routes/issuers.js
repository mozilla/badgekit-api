const Issuers = require('../models/issuer');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/issuers', function showAllIssuers(req, res, next) {
    Issuers.get({}, function (error, rows) {
      if (error) return next(error);
      res.send({issuers: rows.map(issuerFromDb)});
      return next();
    })
  });

  server.get('/issuers/:issuerId', function showOneIssuer(req, res, next) {
    const issuerId = req.params.issuerId;

    const query = {slug: req.params.issuerId};
    Issuers.getOne(query, function (error, row) {
      if (error) return next(error);

      if (!row) {
        res.send(404, {error: 'not found'});
        return next()
      }

      res.send({issuer: issuerFromDb(row)});
      return next();
    })
  });

  server.post('/issuers', function saveIssuer(req, res, next) {
    console.dir(req.body)
    res.send(req.body);
    return next();
  });

};

function issuerFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    email: row.email,
  }
}
