const API = require('../../lib/api');
const StreamableCallback = require('../../lib/streamableCallback')
const Stream = require('stream');
const System = require('../models/system');

exports = module.exports = new API({
  getSystems: function () {
    return System.all();
  },

  getSystem: function (systemId) {
    var cb = new StreamableCallback();
    System.get({slug: systemId, deleted: false}, cb);
    return cb;
  },

  addSystem: function ($data) {
    var cb = new StreamableCallback();
    System.create($data, cb);
    return cb;
  },

  updateSystem: function (systemId, $data) {
    var cb = new StreamableCallback();
    System.get(systemId, function (err, system) {
      system.update($data);
      system.save(cb);
    });
    return cb;
  },

  getSystemPrograms: function (systemId) {
    var stream = new Stream();
    System.get(systemId, function (err, system) {
      system.getPrograms().pipe(stream);
    });
    return stream;
  },

  getSystemIssuers: function (systemId) {
    var stream = new Stream();
    System.get(systemId, function (err, system) {
      system.getIssuers().pipe(stream);
    });
    return stream;
  },

  getSystemBadges: function (systemId) {
    var stream = new Stream();
    System.get(systemId, function (err, system) {
      system.getBadges().pipe(stream);
    });
    return stream;
  }
});
