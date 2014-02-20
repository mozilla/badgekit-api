const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  const active = [
    'chicago-badge',
    'pittsburgh-badge',
    'chicago-library-badge',
    'chicago-scratch-badge'
  ].sort()
  const all = active.concat(['archived-badge']).sort()

  test('get badge list', function (t) {

    function getSlugs(body) {
      return body.badges.map(prop('slug')).sort()
    }

    t.plan(12)

    api.get('/badges').then(function (res) {
      const slugs = getSlugs(res.body)
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs, active, 'should have active badges')
      t.same(slugs.indexOf('archived-badge'), -1, 'should not have archived badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=true').then(function(res){
      t.same(res.body.badges.length, 1, 'should have one badge')
      t.same(res.body.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=1').then(function(res){
      t.same(res.body.badges.length, 1, 'should have one badge')
      t.same(res.body.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=false').then(function(res){
      const slugs = getSlugs(res.body)
      t.same(slugs, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=0').then(function(res){
      const slugs = getSlugs(res.body)
      t.same(slugs, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=any').then(function(res){
      const slugs = getSlugs(res.body)
      t.same(slugs, all, 'should have all badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=weird-value').then(function(res){
      t.same(res.statusCode, 400)
      t.same(res.body.code, 'InvalidParameter')
      t.same(res.body.parameter, 'archived')
    }).catch(api.fail(t))

  })

  test('get a single badge', function (t) {
    api.get('/badges/chicago-badge').then(function (res) {
      t.same(res.body.badge, {
        id: 1,
        slug: 'chicago-badge',
        name: 'Chicago Badge',
        strapline: 'A badge for Chicago',
        description: 'A longer description of the badge',
        imageUrl: null,
        archived: false,
      })
      return api.get('/badges/badge-does-not-exist')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    })
  })

  test('add new badge', function (t) {
    var form;

    api.post('/badges', {whatever: 'lol'}).then(function (res) {
      const expect = ['description', 'image', 'name', 'slug']
      const found = res.body.details.map(prop('field')).sort()

      t.same(res.statusCode, 400, 'should have 400')
      t.same(res.body.code, 'ValidationError', 'should have ValidationError code')
      t.same(found, expect, 'should have right errored fields')

      return api.post('/badges', form = {
        slug: 'test-badge',
        name: 'Test Badge',
        strapline: 'A badge for testing',
        description: 'Some description, eh',
        image: stream('test-image.png'),
      })
    }).then(function (res) {
      t.same(res.statusCode, 201)
      t.same(res.body.status, 'created')
      t.same(res.body.badge.name, form.name)
      t.ok(res.body.badge.imageUrl.match(/\/images\/.+/), 'should have right image url')

      form.image = stream('test-image.png')
      return api.post('/badges', form)
    }).then(function(res){
      t.same(res.statusCode, 409)
      t.end()
    }).catch(api.fail(t))
  })

  test('update badge', function (t) {
    var form = {garbage:'yep', bs:'yah'}

    api.put('/badges/test-badge', form).then(function (res) {
      t.same(res.statusCode, 200, 'should not fail')
      return api.put('/badges/test-badge', form = {
        name: 'Test Badge, obvi',
        description: 'it is still a test!',
      })
    }).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'updated')
      t.same(res.body.badge.name, form.name)
      t.same(res.body.badge.description, form.description)
      t.ok(res.body.badge.imageUrl.match(/\/images\/.+/), 'should have an image url')
      t.end()
    }).catch(api.fail(t))
  })

  test('delete badge', function (t) {
    api.del('/badges/test-badge').then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'deleted')
      return api.get('/badges/test-badge')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})

function stream(file) {
  return fs.createReadStream(path.join(__dirname, file))
}

function prop(name) {
  return function(obj) { return obj[name] }
}
