const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get badge list', function (t) {
    api.get('/badges').then(function (res) {
      t.ok(res.badges, 'should have badges')
      t.same(res.badges[0].slug, 'chicago-badge')
      t.end()
    })
  })

  test('add new badge', function (t) {
    const form = {
      slug: 'test-badge',
      name: 'Test Badge',
      strapline: 'A badge for testing',
      description: 'Some description, eh',
      image: stream('test-image.png'),
    }
    api.post('/badges', form).then(function (res) {
      t.same(res.status, 'created')
      return api.get('/badges/test-badge')
    }).then(function (res) {
      t.same(res.badge.name, form.name)
      t.ok(res.badge.imageUrl.match(/\/images\/.+/), 'should have right image url')
      t.end()
    })
  })

  test('update badge', function (t) {
    const diff = {
      name: 'Test Badge, obvi',
      description: 'it is still a test!',
    }
    api.put('/badges/test-badge', diff).then(function (res) {
      t.same(res.status, 'updated')
      return api.get('/badges/test-badge')
    }).then(function (res) {
      t.same(res.badge.name, diff.name)
      t.same(res.badge.description, diff.description)
      t.end()
    })
  })

  test('delete badge', function (t) {
    api.del('/badges/test-badge').then(function (res) {
      t.same(res.status, 'deleted')
      return api.get('/programs/test-badge')
    }).then(function (res) {
      t.same(res.error, 'not found')
      t.end()
    })
  })


  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})

function stream(file) {
  return fs.createReadStream(path.join(__dirname, file))
}
