const db = require('./db');

var System = new db.Model('System', {
  fields: {
    'systemId': {
      type: 'int',
      private: true,
    },
    'slug': {
      type: 'string'
    },
    'name': {
      type: 'string'
    },
    'image': {
      type: 'string'
    },
    'deleted': {
      type: 'boolean',
      private: true
    }
  },
  primaryKey: 'systemId'
});

System.prototype.getPrograms = function (callback) {
  
}

System.prototype.getIssuers = function (callback) {
  
}

System.prototype.getBadges = function (callback) {
  
}

exports = module.exports = System;
