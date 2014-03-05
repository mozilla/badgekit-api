const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('Create a new claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes'
    const form = { code: 'stuff' }
    api.post(url, form).then(function (res) {
      t.same(res.statusCode, 201, 'statuscode 201')
      t.same(res.body.claimCode.code, 'stuff')
      t.end()
    })
  })

  test('List all claimcodes', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/codes'
    api.get(url).then(function (res) {
      t.same(res.body.claimCodes.length, 2, 'should have right amount of codes')
      t.same(res.body.badge.slug, 'chicago-badge', 'should get badge back as well')
      t.end()
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})
