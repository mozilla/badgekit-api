const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('Get an image', function (t) {
    api.get('/public/images/some-image').then(function(res) {
      t.same(res.body.location, 'http://example.org/test.png')
      t.end()
    })
  })

  test('HTTP 404', function (t) {
    api.get('/public/images/some-image-that-does-not-exist').then(function(res) {
      t.same(res.body.code, 'ResourceNotFound')
      t.same(res.statusCode, 404)
      t.end()
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
