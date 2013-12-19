const xtend = require('xtend');
var Badges = require('../models/badge');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/badges', showAllBadges);
  function showAllBadges (req, res, next) {
    Badges.get({}, function foundRows (error, rows) {
      if (error)
        return handleError(error, null, res, next);

      res.send({badges: rows.map(badgeFromDb)});
      return next();
    });
  }

  server.post('/badges', saveBadge);
  function saveBadge (req, res, next) {
    const row = fromPostToRow(req.body);
    const validationErrors = Badges.validateRow(row);

    if (validationErrors.length) {
      res.send(400, {errors: validationErrors});
      return next();
    }

    Badges.put(row, function savedRow (error, result) {
      if (error)
        return handleError(error, row, res, next);

      res.send(201, {status: 'created'});
      return next();
    });
  }

  server.get('/badges/:badgeId', showOneBadge);
  function showOneBadge (req, res, next) {
    getBadge(req, res, next, function (row) {
      res.send({badge: badgeFromDb(row)});
      return next();
    });
  }

  server.del('/badges/:badgeId', deleteBadge);
  function deleteBadge (req, res, next) {
    getBadge(req, res, next, function (row) {
      Badges.del(row, function deletedRow (error, result) {
        if (error)
          return handleError(error, row, req, next);
        res.send({status: 'deleted', row: row});
      });
    });
  }

  server.put('/badges/:badgeId', updateBadge);
  function updateBadge (req, res, next) {
    getBadge(req, res, next, function (row) {
      const updated = xtend(row, req.body);
      Badges.put(updated, function updatedRow (error, result) {
        if (error)
          return handleError(error, row, res, next);
        res.send({status: 'updated'});
      });
    });
  }

};

function getBadge (req, res, next, callback) {
  const query = {slug: req.params.badgeId};
  Badges.getOne(query, function foundBadge (error, row) {
    if (error)
      return handleError(error, row, res, next);

    if (!row) {
      res.send(404, {error: 'not found'});
      return next();
    }

    return callback(row);
  });
}

const errorCodes = {
  ER_DUP_ENTRY: [409, {error: 'A badge with that `slug` already exists'}]
};

function handleError (error, row, res, next) {
  const expected = knownError(error, row);
  if (!expected) return next(error);
  res.send.apply(res, expected);
  return next();
}

function knownError (error, row) {
  const err = errorCodes[error.code];
  if (!err) return;
  if (row) err[1].received = row;
  return err;
}

function fromPostToRow (post) {
  return {
    slug: post.slug,
    name: post.name,
    strapline: post.strapline,
    description: post.description
  };
}

function badgeFromDb (row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description
  };
}
