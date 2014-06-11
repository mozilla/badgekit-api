const Promise = require('bluebird');
const log = require('../lib/logger');
const db = require('../lib/db');
const request = require('request');
const sha256 = require('../lib/hash').sha256;
const jws = require('jws');

const Webhooks = db.table('webhooks', {
  fields: [
    'id',
    'url',
    'secret',
    'systemId',
  ],
  relationships: {
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: false,
    },
  },
  methods: {
    call: function (hookData, callback) {
      const hookDataString = JSON.stringify(hookData);
      const hookDataHash = sha256(hookDataString);
      const token = jws.sign({
        secret: this.secret,
        header: {typ: 'JWT', alg: 'HS256'},
        payload: {
          body: {
            alg: 'sha256',
            hash: hookDataHash,
          },
        },
      });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'JWT token="'+token+'"',
      };

      return new Promise(function (resolve, reject) {
        request.post({
          url: this.url,
          body: hookDataString,
          headers: headers,
        }, function (err, res, body) {
          if (callback)
            return callback(err, res, body);

          if (err)
            return reject(err)

          return resolve({ res: res, body: body });
        });
      }.bind(this))
    }
  }
});

exports = module.exports = Webhooks;
