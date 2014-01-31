const restify = require('restify')
const safeExtend = require('../lib/safe-extend');
const imageHelper = require('../lib/image-helper')
const Badges = require('../models/badge');

const putBadge = imageHelper.putModel(Badges)

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/badges', showAllBadges);
  function showAllBadges (req, res, next) {
    var query;
    var options = {relationships: true};

    switch ('' + req.query.archived) {
      case 'true':
      case '1':
        query = {archived: true};
        break;

      case 'false':
      case '0':
      case 'undefined':
        query = {archived: false};
        break;

      case 'any':
      case '':
        query = {};
        break;

      default:
        return res.send(400, {
          code: 'InvalidParameter',
          parameter: 'archived',
          message: 'Invalid `archived` parameter. Expecting one of \'true\', \'false\' or \'any\'.',
        });
    }

    Badges.get(query, options, function foundRows (error, rows) {
      if (error)
        return handleError(error, null, res, next);

      res.send({badges: rows.map(badgeFromDb)});
      return next();
    });
  }

  server.post('/badges', saveBadge);
  function saveBadge (req, res, next) {
    var row = fromPostToRow(req.body);
    var image = (req.files || {}).image || {};
    if (!image.size)
      image = req.body.image || {};

    putBadge(row, image, function (err, result) {
      if (err) {
        if (!Array.isArray(err))
          return handleError(err, row, res, next);

        return res.send(400, {
          code: 'ValidationError',
          message: 'Could not validate required fields',
          details: err,
        });
      }

      res.send(201, {status: 'created', badge: row});
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
      Badges.del({id: row.id}, function deletedRow (error, result) {
        if (error)
          return handleError(error, row, req, next);
        res.send({status: 'deleted', badge: badgeFromDb(row)});
      });
    });
  }

  server.put('/badges/:badgeId', updateBadge);
  function updateBadge (req, res, next) {
    getBadge(req, res, next, function (badge) {
      var row = safeExtend(badge, req.body);
      delete row.image

      row.issuerId = row.issuerId || undefined;
      var image = (req.files || {}).image || {};
      if (!image.size)
        image = req.body.image || null;

      putBadge(row, image, function (err, result) {
        if (err) {
          if (!Array.isArray(err))
            return handleError(err, row, res, next);

          return res.send(400, {
            code: 'ValidationError',
            message: 'Could not validate required fields',
            details: err,
          });
        }

        res.send({status: 'updated', badge: row});
      });
    });
  }

};

function getBadge (req, res, next, callback) {
  const query = {slug: req.params.badgeId};
  const options = {relationships: true};
  Badges.getOne(query, options, function foundBadge (error, row) {
    if (error)
      return handleError(error, row, res, next);

    if (!row) {
      const notFoundErr = new restify.ResourceNotFoundError('Could not find badge with slug `'+query.slug+'`')
      return next(notFoundErr);
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
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description,
    imageUrl: row.image ? row.image.toUrl() : null,
    archived: !!row.archived
  };
}
