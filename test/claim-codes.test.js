const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('Create a new claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes'
    const form = { code: 'test' }
    api.post(url, form).then(function (res) {
      t.same(res.statusCode, 201, 'statuscode 201')
      t.same(res.body.claimCode.code, 'test')
      t.end()
    }).catch(api.fail(t))
  })

  test('Create an invalid claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes'
    const form = { multiuse: 1 }
    api.post(url, form).then(function (res) {
      t.same(res.statusCode, 400, 'statuscode 400')
      t.same(res.body.code, 'ValidationError', 'should not validate')
      t.end()
    }).catch(api.fail(t))
  })

  test('List all claimcodes', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes?page=1&count=5'
    api.get(url).then(function (res) {
      t.same(res.body.claimCodes.length, 4, 'should have right amount of codes')
      t.same(res.body.pageData.page, 1, 'page data should indicate page 1')
      t.same(res.body.pageData.count, 5, 'page data should indicate a count of 5')
      t.same(res.body.pageData.total, 4, 'page data should indicate a total of 4')
      t.same(res.body.badge.slug, 'chicago-badge', 'should get badge back as well')
      t.end()
    }).catch(api.fail(t))
  })

  test('Claim a claimcode', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes/test/claim'
    const email = 'brian@example.org'
    const form = { email: email }
    api.post(url, form).then(function (res) {
      t.same(res.statusCode, 200, 'should get 200')
      t.same(res.body.claimCode.email, email, 'should have right email')
      return api.post(url, form)
    }).then(function (res) {
      t.same(res.statusCode, 400, 'should get an error')
      t.same(res.body.code, 'CodeAlreadyUsed', 'should get the right error')
      t.end()
    }).catch(api.fail(t))
  })

  test('Get a new random code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes/random'
    api.post(url).then(function (res) {
      const code = res.body.claimCode
      t.same(res.statusCode, 201, 'should have been created')
      t.ok(code.code.length > 1, 'should have created a claim code')
      t.end()
    }).catch(api.fail(t))
  })

  test('Delete a claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes/delete-me'
    api.del(url).then(function (res) {
      t.same(res.statusCode, 200)
      t.same(res.body.status, 'deleted')
      return api.del(url)
    }).then(function (res) {
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })

  test('Look up a badge via claim code', function (t) {
    const url = '/systems/chicago/codes/single-use'
    api.get(url).then(function (res) {
      t.same(res.statusCode, 200, 'should get 200')
      t.same(res.body.badge.slug, 'chicago-badge', 'should find chicago badge')
      t.end()
    }).catch(api.fail(t))
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})
