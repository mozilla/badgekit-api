const crypto = require('crypto');
const fs = require('fs');
const xtend = require('xtend');

const Badges = require('../models/badge');
const Images = require('../models/image');

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
    const image = (req.files || {}).image || {};
    const imageRow = {
      slug: 'tmp',
      url: req.body.image,
      mimetype: image.type,
      size: image.size
    };

    function finish (err, imageId) {
      if (err)
        return handleError(err, row, res, next);

      row.imageId = imageId;

      Badges.put(row, function savedRow (error, result) {
        // Errors raised here will leave orphan images in the database
        // We probably want to handle those, but now sure how best to do so

        if (error)
          return handleError(error, row, res, next);

        res.send(201, {status: 'created'});
        return next();
      });
    }

    const validationErrors = []
      .concat(Badges.validateRow(row))
      .concat(Images.validateRow(imageRow));

    if (!imageRow.size && !imageRow.url) {
      validationErrors.push({
        name: 'ValidatorError',
        message: "Missing value",
        field: 'image'
      });
    }

    if (validationErrors.length) {
      res.send(400, {errors: validationErrors});
      return next();
    }

    if (image.size)
      return createImageFromFile(image, finish);

    if (req.body.image)
      return createImageFromUrl(req.body.image, finish);
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
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description
  };
}

function hashString (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function createImageFromFile (file, callback) {
  fs.readFile(file.path, function (err, data) {
    if (err)
      return callback(err);

    const row = {
      slug: hashString(Date.now() + file.path),
      mimetype: file.type,
      data: data
    };

    Images.put(row, function (err, result) {
      console.log(err, result);
      callback(err, result.insertId);
    });
  });
}

function createImageFromUrl (url, callback) {
  const row = {
    slug: hashString(Date.now() + url),
    url: url
  };

  Images.put(row, function (err, result) {
    callback(err, result.insertId);
  });
}
