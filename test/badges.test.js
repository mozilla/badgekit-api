const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  const active = ['chicago-badge', 'pittsburgh-badge']
  const all = active.concat(['archived-badge']).sort()

  test('get badge list', function (t) {

    function getSlugs(res) {
      return res.badges.map(function (x) {return x.slug}).sort()
    }

    t.plan(9)

    api.get('/badges').then(function (res) {
      const slugs = getSlugs(res)
      t.ok(res.badges, 'should have badges')
      t.same(slugs, active, 'should have active badges')
      t.same(slugs.indexOf('archived-badge'), -1, 'should not have archived badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=true').then(function(res){
      t.same(res.badges.length, 1, 'should have one badge')
      t.same(res.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=1').then(function(res){
      t.same(res.badges.length, 1, 'should have one badge')
      t.same(res.badges[0].slug, 'archived-badge')
    }).catch(api.fail(t))

    api.get('/badges?archived=false').then(function(res){
      const slugs = getSlugs(res)
      t.same(slugs, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=0').then(function(res){
      const slugs = getSlugs(res)
      t.same(slugs, active, 'should have active badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=any').then(function(res){
      const slugs = getSlugs(res)
      t.same(slugs, all, 'should have all badges')
    }).catch(api.fail(t))

    api.get('/badges?archived=weird-value').then(function(res){
      console.dir(res)
    }).catch(api.fail(t))

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
    }).catch(api.fail(t))
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
    }).catch(api.fail(t))
  })

  test('delete badge', function (t) {
    api.del('/badges/test-badge').then(function (res) {
      t.same(res.status, 'deleted')
      return api.get('/programs/test-badge')
    }).then(function (res) {
      t.same(res.error, 'not found')
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
