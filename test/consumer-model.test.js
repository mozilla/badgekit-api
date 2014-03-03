const test = require('tap').test;
const Consumers = require('../app/models/consumer');
// needed for relationship fulfillment
const Systems = require('../app/models/system')

const closeDb = Consumers.db.close.bind(Consumers.db);

test('Consumers#findByKey', function (t) {
  Consumers.findByKey('radical', function (err, consumer) {
    t.same(consumer.apiSecret, 'At9p1PVNW5jQAV8LnvfGdpbnuAcxq765pBNNhV9Kjnvgyn4S7YEs7KgVla1OGyny')
    t.same(consumer.system.slug, 'chicago')
    t.end()
  })
})

test(':cleanup:', function (t) {
  closeDb(), t.end();
})
