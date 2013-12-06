const streamsql = require('streamsql');
const config = require('../lib/config');

const db = streamsql.connect(config('db'));

function Model (name, config) {
  var pk = config.primaryKey || 'id';
  var fields = config.fields || {};
  var dirty = {};

  if (fields instanceof Array) {
    fields = fields.reduce(function(obj, key) {
      return (obj[key] = {}, obj);
    }, {});
  }

  var fieldList = Object.keys(fields);

  var table = db.table(name, {
    primaryKey: pk,
    tableName: config.tableName,
    fields: fieldList,
    relationships: config.relationships,
    constructor: model
  });

  function model (meta) {
    var data = {};

    fieldList.forEach(function(field) {
      Object.defineProperty(this, field, {
        __proto__: null,
        enumerable: !fields[field].private,
        get: function () {
          return data[field];
        },
        set: function (value) {
          // TODO - validate
          data[field] = value;

          if (value === meta[field])
            delete dirty[field]
          else
            dirty[field] = true;
        }
      });

      this[field] = meta[field];
    }.bind(this));

    Object.defineProperty(this, '$table', {
      __proto__: null,
      value: table
    });

    Object.defineProperty(this, '$fields', {
      __proto__: null,
      value: fieldList
    });

    Object.defineProperty(this, '$dirty', {
      __proto__: null,
      get: function () {
        return !!Object.keys(dirty).length;
      }
    });
  }

  model.all = function (callback) {
    return this.find({deleted: false}, callback);
  }

  model.find = function (query, callback) {
    if (typeof callback === 'function')
      return table.get(query, callback)
    return table.createReadStream(query);
  }

  model.get = function (query, callback) {
    table.getOne(query, function (err, item) {
      if (err)
        return callback(err);
      if (!item)
        return callback(new ReferenceError('Invalid Query'));

      callback(null, item);
    });
  }

  model.create = function (meta, callback) {
    try {
      var instance = new model(meta);
      instance.save(function(err) {
        if (err)
          return callback(err);
        callback(null, instance);
      });
    } catch (e) {
      callback(e);
    }
  }

  model.prototype.save = function (callback) {
    // TODO
    callback();
  }

  model.prototype.update = function (meta, callback) {
    try {
      this.$fields.forEach(function(field) {
        if (meta.hasOwnProperty(field)) {
          this[field] = meta[field];
        }
      });
      callback()
    } catch (e) {
      callback(e);
    }
  }

  return model;
}

db.Model = Model;

exports = module.exports = db;
