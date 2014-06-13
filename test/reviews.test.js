const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('get reviews list', function (t) {
    var active = {}

    function getSlugs(body) {
      return body.reviews.map(prop('slug')).sort()
    }

    t.plan(12);

    api.get('/systems/chicago/badges/chicago-scratch-badge/applications/app-scratch/reviews?page=1&count=1').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.reviews
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(res.body.pageData.total, 1)
      t.same(res.body.pageData.page, 1)
      t.same(res.body.pageData.count, 1)
      t.same(slugs.indexOf('review-archived'), -1, 'should not have archived badge review)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/badges/chicago-scratch-badge/applications/app-scratch/reviews').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.reviews
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('review-archived'), -1, 'should not have archived badge review)')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews').then(function (res) {
      const slugs = getSlugs(res.body)
      active = res.body.reviews
      t.same(res.statusCode, 200, 'should have HTTP 200')
      t.same(slugs.length, 1)
      t.same(slugs.indexOf('review-archived'), -1, 'should not have archived badge review)')
    }).catch(api.fail(t))
  })

  test('get single review', function (t) {
    t.plan(9);

    api.get('/systems/chicago/badges/chicago-scratch-badge/applications/app-scratch/reviews/review-scratch').then(function (res) {
      t.same(res.body.review.slug, 'review-scratch')
      return api.get('/systems/chicago/badges/chicago-scratch-badge/applications/app-scratch/reviews/fake-review')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/badges/chicago-scratch-badge/applications/app-scratch/reviews/review-scratch').then(function (res) {
      t.same(res.body.review.slug, 'review-scratch')
      return api.get('/systems/chicago/issuer/chicago-library/badges/chicago-scratch-badge/applications/app-scratch/reviews/fake-review')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))

    api.get('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews/review-scratch').then(function (res) {
      t.same(res.body.review.slug, 'review-scratch')
      return api.get('/systems/chicago/issuer/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews/fake-review')
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
    }).catch(api.fail(t))
  })

  var newAppUrl;

  test('add new review', function (t) {
    var form;

    api.post('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews', {whatever: 'lol'}).then(function (res) {
      const expect = ['author']
      const found = res.body.details.map(prop('field')).sort()

      t.same(res.statusCode, 400, 'should have 400')
      t.same(res.body.code, 'ValidationError', 'should have ValidationError code')
      t.same(found, expect, 'should have right errored fields')

      return api.post('/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews', form = {
        author: 'somedude@example.org'
      })
    }).then(function (res) {
      t.same(res.statusCode, 201)
      t.same(res.body.status, 'created')
      t.same(res.body.review.author, form.author)
      newReviewUrl = '/systems/chicago/issuers/chicago-library/programs/mit-scratch/badges/chicago-scratch-badge/applications/app-scratch/reviews/' + res.body.review.slug
      t.end()
    }).catch(api.fail(t))
  })

  test('update review', function (t) {
    var form = {garbage:'yep', bs:'yah'}

    api.put(newReviewUrl, form).then(function (res) {
      t.same(res.statusCode, 200, 'should not fail')
      return api.put(newReviewUrl, form = {
        author: 'newauthor@example.org',
        comment: 'blah blah',
        // can't test reviewItems, as formdata does not support arrays.  Need to look into workaround, as this is pretty important.
      })
    }).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'updated')
      t.same(res.body.review.author, form.author)
      t.same(res.body.review.comment, form.comment)
      t.end()
    }).catch(api.fail(t))
  })

  test('delete review', function (t) {
    api.del(newReviewUrl).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'deleted')
      return api.get(newReviewUrl)
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
