const Issuers = require('../models/issuer');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/issuers', function showAllIssuers(req, res, next) {
    Issuers.get({}, function (error, rows) {
      if (error)
        return next(error);
      res.send({issuers: rows.map(issuerFromDb)});
      return next();
    })
  });

  server.get('/issuers/:issuerId', function showOneIssuer(req, res, next) {
    const issuerId = req.params.issuerId;

    const query = {slug: req.params.issuerId};
    Issuers.getOne(query, function (error, row) {
      if (error)
        return next(error);

      if (!row) {
        res.send(404, {error: 'not found'});
        return next()
      }

      res.send({issuer: issuerFromDb(row)});
      return next();
    })
  });

  server.post('/issuers', function saveIssuer(req, res, next) {
    const row = fromPostToRow(req.body);
    const errors = Issuers.validateRow(row);

    if (errors.length) {
      res.send(400, {errors: errors})
      return next()
    }

    Issuers.put(row, function (error, result) {
      // TODO: attempt error handling so it doesn't bubble up as a 500
      if (error)
        return next(error)

      console.dir(result)

      res.send({status: 'created'})
      return next();
    })
  });

};

function fromPostToRow(post) {
  return {
    slug: post.slug,
    url: post.url,
    name: post.name,
    email: post.email,
  }
}

function issuerFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    email: row.email,
  }
}
