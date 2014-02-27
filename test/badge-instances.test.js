const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('creating a new badge instance', function (t) {
    api.post('/systems/chicago/badges/chicago-badge/instances', {
      garbage: 'yep',
      nonsense: 'totally'
    }).then(function (res) {
      t.same(res.statusCode, 400, 'should get validation errors')
      return api.post('/systems/chicago/badges/chicago-badge/instances', {
        email: 'brian@example.org',
        expires: (Date.now()/1000|0) + 8600,
      })
    }).then(function (res) {
      t.same(res.statusCode, 201, 'should get created')
      const url = res.headers.location
      return api.get(url)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      const url = res.body.badge
      return api.get(url)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      const url = res.body.issuer
      console.dir(url)
      return api.get(url)
    }).then(function(res) {
      console.dir(res)
      t.end()
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
