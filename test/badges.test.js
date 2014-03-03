const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('get badge list', function (t) {
    var active = {}

    function getSlugs(body) {
      return body.badges.map(prop('slug')).sort()
    }

    t.plan(22)

    api.get('/systems/chicago/badges').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.badges
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 3)
      t.same(slugs.indexOf('archived-badge'), -1, 'should not have archived badge')
      t.same(slugs.indexOf('pittsburgh-badge'), -1, 'should not find pittsburgh badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/badges').then(function (res) {
      const slugs = getSlugs(res.body)
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 2)
      t.same(slugs.indexOf('chicago-badge'), -1, 'should not find system level badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges').then(function (res) {
      const slugs = getSlugs(res.body)
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('chicago-badge'), -1, 'should not find system level badge')
      t.same(slugs.indexOf('chicago-library-badge'), -1, 'should not find issuerlevel badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=true').then(function(res){
      t.same(res.body.badges.length, 1, 'should have one badge')
      t.same(res.body.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=1').then(function(res){
      t.same(res.body.badges.length, 1, 'should have one badge')
      t.same(res.body.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=false').then(function(res){
      t.same(res.body.badges, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=0').then(function(res){
      t.same(res.body.badges, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=any').then(function(res){
      const slugs = getSlugs(res.body)
      t.ok(slugs.indexOf('archived-badge') > -1, 'should not have archived badge')
      t.ok(slugs.indexOf('chicago-badge') > -1, 'should not have archived badge')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges?archived=weird-value').then(function(res){
      t.same(res.statusCode, 400)
      t.same(res.body.code, 'InvalidParameter')
      t.same(res.body.parameter, 'archived')
    }).catch(api.fail(t))

  })

  test('get a single badge', function (t) {
    api.get('/systems/chicago/badges/chicago-badge').then(function (res) {
      t.same(res.body.badge.slug, 'chicago-badge')
      return api.get('/systems/chicago/badges/badge-does-not-exist')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    })
  })

  test('add new badge', function (t) {
    var form;

    api.post('/systems/chicago/issuers/chicago-library/badges', {whatever: 'lol'}).then(function (res) {
      const expect = ['consumerDescription', 'earnerDescription', 'image', 'name', 'slug', 'unique']
      const found = res.body.details.map(prop('field')).sort()

      t.same(res.statusCode, 400, 'should have 400')
      t.same(res.body.code, 'ValidationError', 'should have ValidationError code')
      t.same(found, expect, 'should have right errored fields')

      return api.post('/systems/chicago/issuers/chicago-library/badges', form = {
        slug: 'test-badge',
        name: 'Test Badge',
        strapline: 'A badge for testing',
        earnerDescription: 'Some description, eh',
        consumerDescription: 'Some description, o',
        unique: 0,
        image: stream('test-image.png'),
      })
    }).then(function (res) {
      t.same(res.statusCode, 201)
      t.same(res.body.status, 'created')
      t.same(res.body.badge.name, form.name)
      t.same(res.body.badge.system.slug, 'chicago')
      t.same(res.body.badge.issuer.slug, 'chicago-library')
      t.ok(res.body.badge.imageUrl.match(/\/images\/.+/), 'should have right image url')

      form.image = stream('test-image.png')
      return api.post('/systems/chicago/issuers/chicago-library/badges', form)
    }).then(function(res){
      t.same(res.statusCode, 409)
      t.end()
    }).catch(api.fail(t))
  })

  test('update badge', function (t) {
    var form = {garbage:'yep', bs:'yah'}

    api.put('/systems/chicago/issuers/chicago-library/badges/test-badge', form).then(function (res) {
      t.same(res.statusCode, 200, 'should not fail')
      return api.put('/systems/chicago/issuers/chicago-library/badges/test-badge', form = {
        name: 'Test Badge, obvi',
        earnerDescription: 'it is still a test!',
      })
    }).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'updated')
      t.same(res.body.badge.name, form.name)
      t.same(res.body.badge.earnerDescription, form.earnerDescription)
      t.ok(res.body.badge.imageUrl.match(/\/images\/.+/), 'should have an image url')
      t.end()
    }).catch(api.fail(t))
  })

  test('delete badge', function (t) {
    api.del('/systems/chicago/issuers/chicago-library/badges/test-badge').then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'deleted')
      return api.get('/systems/chicago/issuers/chicago-library/badges/test-badge')
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
