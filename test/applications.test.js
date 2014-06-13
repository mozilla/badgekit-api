const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('get applications list', function (t) {
    var active = {}

    function getSlugs(body) {
      return body.applications.map(prop('slug')).sort()
    }

    t.plan(32);

    api.get('/systems/chicago/applications?page=1&count=2').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 2)
      t.same(res.body.pageData.total, 2)
      t.same(res.body.pageData.page, 1)
      t.same(res.body.pageData.count, 2)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
    }).catch(api.fail(t))

    api.get('/systems/chicago/applications?processed=true').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-scratch'), -1, 'should not have unprocessed badge application')
    }).catch(api.fail(t))

    api.get('/systems/chicago/applications?processed=false').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-archived'), -1, 'should not have processed badge application')
    }).catch(api.fail(t))

    api.get('/systems/chicago/badges/chicago-scratch-badge/applications').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
      t.same(slugs.indexOf('app-archived'), -1, 'should not have archived badge application)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/applications').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
      t.same(slugs.indexOf('app-archived'), -1, 'should not have archived badge application)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/badges/chicago-scratch-badge/applications').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
      t.same(slugs.indexOf('app-archived'), -1, 'should not have archived badge application)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/applications').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
      t.same(slugs.indexOf('app-archived'), -1, 'should not have archived badge application)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.applications
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('app-pittsburgh'), -1, 'should not have pittsburgh system application')
      t.same(slugs.indexOf('app-archived'), -1, 'should not have archived badge application)')
    }).catch(api.fail(t))
  })

  test('get single application', function (t) {
    t.plan(9);

    api.get('/systems/chicago/badges/chicago-scratch-badge/applications/app-scratch').then(function (res) {
      t.same(res.body.application.slug, 'app-scratch')
      return api.get('/systems/chicago/badges/chicago-scratch-badge/applications/app-does-not-exist')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/badges/chicago-scratch-badge/applications/app-scratch').then(function (res) {
      t.same(res.body.application.slug, 'app-scratch')
      return api.get('/systems/chicago/issuer/chicago-library/badges/chicago-scratch-badge/applications/app-does-not-exist')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch').then(function (res) {
      t.same(res.body.application.slug, 'app-scratch')
      return api.get('/systems/chicago/issuer/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-does-not-exist')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))
  })

  var newAppUrl;

  test('add new application', function (t) {
    var form;

    api.post('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications', {whatever: 'lol'}).then(function (res) {
      const expect = ['learner']
      const found = res.body.details.map(prop('field')).sort()

      t.same(res.statusCode, 400, 'should have 400')
      t.same(res.body.code, 'ValidationError', 'should have ValidationError code')
      t.same(found, expect, 'should have right errored fields')

      return api.post('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications', form = {
        learner: 'somedude@example.org'
      })
    }).then(function (res) {
      t.same(res.statusCode, 201)
      t.same(res.body.status, 'created')
      t.same(res.body.application.learner, form.learner)
      t.same(res.body.application.badge.slug, 'chicago-scratch-badge')
      newAppUrl = '/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/' + res.body.application.slug
      t.end()
    }).catch(api.fail(t))
  })

  test('update application', function (t) {
    var form = {garbage:'yep', bs:'yah'}

    api.put(newAppUrl, form).then(function (res) {
      t.same(res.statusCode, 200, 'should not fail')
      return api.put(newAppUrl, form = {
        learner: 'newlearner@example.org',
        assignedTo: 'somedude@example.org'
        // can't test evidence, as formdata does not support arrays.  Need to look into workaround, as this is pretty important.
      })
    }).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'updated')
      t.same(res.body.application.learner, form.learner)
      t.same(res.body.application.assignedTo, form.assignedTo)
      t.end()
    }).catch(api.fail(t))
  })

  test('delete application', function (t) {
    api.del(newAppUrl).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'deleted')
      return api.get(newAppUrl)
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

function prop(name) {
  return function(obj) { return obj[name] }
}
