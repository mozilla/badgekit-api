module.exports = {
  createFromFile: createFromFile,
  createFromUrl: createFromUrl,
  createFromData: createFromData,
  getFromPost: getFromPost,
  putModel: putModel,
}

const fs = require('fs')
const crypto = require('crypto')
const Images = require('../models/image')

function hashString (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function getFromPost(req, opts) {
  opts = opts || {}
  // first see if we have an uploaded file
  var image = (req.files || {}).image || {};

  // if there's no size on it, we assume it's a url
  if (!image.size)
    image = req.body.image;

  if (opts.required)
    image = image || {}

  return image
}

function createFromFile (file, callback) {
  fs.readFile(file.path, function (err, data) {
    if (err)
      return callback(err);

    const row = {
      slug: hashString(Date.now() + file.path),
      mimetype: file.mimetype,
      data: data
    };

    Images.put(row, function (err, result) {
      callback(err, result.insertId);
    });
  });
}

function createFromUrl (url, callback) {
  const scheme = (/^([a-z]+):/i.exec(url)||['']).pop().toLowerCase();

  if (scheme === 'data')
    return createFromData(url, callback);

  const row = {
    slug: hashString(Date.now() + url),
    url: url
  };

  Images.put(row, function (err, result) {
    callback(err, result.insertId);
  });
}

function createFromData (data, callback) {
  if (typeof data === 'string') {
    const parts = /^(?:data:)?(?:([^;]+);)?(?:charset=(.*);)?(?:([^,]+),)?(.*)$/i.exec(data);

    data = {
      mimetype: parts[1],
      charset: parts[2],
      encoding: parts[3],
      data: parts[4]
    };
  }

  const mimetype = data.mimetype || 'text/plain';
  const charset = data.charset || 'US-ASCII';
  const encoding = data.encoding || null;

  const buffer = new Buffer(data.data, encoding);

  const row = {
    slug: hashString(Date.now() + data.data),
    mimetype: mimetype,
    data: buffer
  };

  Images.put(row, function (err, result) {
    callback(err, result.insertId);
  });
}

function putModel(Model) {
  return function put(data, image, callback) {
    function finish(err, imageId) {
      if (err)
        return callback(err);

      if (imageId)
        data.imageId = imageId;

      Model.put(data, function (err, result) {
        if (err)
          return callback(err)

        const query = {slug: data.slug};
        const options = {relationships: true};
        return Model.getOne(query, options, callback)
      });
    }

    var validationErrors = Model.validateRow(data);

    if (image) {
      if (typeof image === 'string') {
        if (/^data:/.test(image))
          image = {data: image};
        else
          image = {url: image};
      } else {
        image = {
          mimetype: image.type,
          size: image.size,
          path: image.path
        };
      }
      image.slug = 'tmp';

      validationErrors = validationErrors.concat(Images.validateRow(image));

      if (!image.size && !image.url && !image.data) {
        validationErrors.push({
          message: "Missing value",
          field: 'image'
        });
      }
    }

    if (validationErrors.length)
      return finish(validationErrors);

    if (!image)
      return finish();

    if (image.size)
      return createFromFile(image, finish);

    if (image.url)
      return createFromUrl(image.url, finish);

    if (image.data)
      return createFromData(image.data, finish);
  }
}
