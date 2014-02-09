const safeExtend = require('../lib/safe-extend')
const Badges = require('../models/badge');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')

const putBadge = imageHelper.putModel(Badges)
const dbErrorHandler = errorHelper.makeDbHandler('badge')

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
        return dbErrorHandler(error, null, res, next);

      res.send({badges: rows.map(badgeFromDb)});
      return next();
    });
  }

  server.post('/badges', saveBadge);
  function saveBadge (req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req, {required: true})

    putBadge(row, image, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send(201, {
        status: 'created',
        badge: badgeFromDb(badge)
      });
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
          return dbErrorHandler(error, row, req, next);

        res.send({
          status: 'deleted',
          badge: badgeFromDb(row)
        });
      });
    });
  }

  server.put('/badges/:badgeId', updateBadge);
  function updateBadge (req, res, next) {
    getBadge(req, res, next, function (badge) {
      const row = safeExtend(badge, req.body);
      const image = imageHelper.getFromPost(req);

      // TODO: This is kind of silly. We need a better way to handle
      // updates. Maybe streamsql should throw back `undefined` instead
      // of `null` when the fields don't exist. Also, `getBadge` should
      // have an option for *not* fulfilling relationships, so we don't
      // have to delete `image`. Either that or streamsql can have an
      // option for ignoring fields it doesn't recognize, which is
      // probably the sanest option.
      delete row.image;
      row.systemId = row.systemId || undefined;
      row.issuerId = row.issuerId || undefined;
      row.programId = row.programId || undefined;

      putBadge(row, image, function (err, badge) {
        if (err) {
          if (!Array.isArray(err))
            return dbErrorHandler(err, row, res, next);
          return res.send(400, errorHelper.validation(err));
        }

        res.send({
          status: 'updated',
          badge: badgeFromDb(badge)
        });
      });
    });
  }

};

function getBadge (req, res, next, callback) {
  const query = {slug: req.params.badgeId};
  const options = {relationships: true};
  Badges.getOne(query, options, function foundBadge (error, row) {
    if (error)
      return dbErrorHandler(error, row, res, next);

    if (!row)
      return next(errorHelper.notFound('Could not find badge with slug `'+query.slug+'`'));

    return callback(row);
  });
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
    description: row.description,
    imageUrl: row.image ? row.image.toUrl() : null,
    archived: !!row.archived
  };
}
