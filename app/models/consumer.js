const db = require('../lib/db');
const Consumers = db.table('consumers', {
  fields: [
    'id',
    'apiKey',
    'apiSecret',
    'description',
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
})

Consumers.findByKey = function findByKey(key, callback) {
  const query = {apiKey: key}
  const opts = {relationships: true}
  Consumers.getOne(query, opts, callback)
}

exports = module.exports = Consumers
