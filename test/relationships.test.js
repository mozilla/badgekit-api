const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('get system/issuer list', function (t) {
    api.get('/systems/chicago/issuers').then(function (res) {
      t.same(res.body.issuers, [
        { id: 1,
          slug: 'chicago-library',
          url: 'http://www.chipublib.org/',
          name: 'Chicago Public Library',
          description: 'Chicago Public Library',
          email: 'eratosthenes@chipublib.org',
          imageUrl: 'http://example.org/test.png'
        },
      ], 'should get the right list')
      return api.get('/systems/bogus/issuers')
    }).then(function (res) {
      t.same(res.statusCode, 404, 'should get a 404')
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })

  test('get issuer/program list', function (t) {
    api.get('/issuers/chicago-library/programs').then(function (res) {
      t.same(res.body.programs, [
        { id: 1,
          slug: 'mit-scratch',
          url: 'http://scratch.mit.edu/',
          name: 'MIT Scratch',
          description: 'Create stories, games, and animations. Share with others around the world',
          email: 'admin@scratch.mit.edu',
          imageUrl: null
        },
      ])
      return api.get('/issuers/bogus/programs')
    }).then(function (res) {
      t.same(res.statusCode, 404, 'should get a 404')
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })

  test('get program/badges list', function (t) {
    api.get('/programs/mit-scratch/badges').then(function (res) {
      t.same(res.body.badges, [
        { id: 4,
          slug: 'chicago-scratch-badge',
          name: 'Chicago Scratch Badge',
          strapline: 'A badge for doing Scratch in Chicago',
          description: 'A longer description of the badge',
          imageUrl: null,
          archived: false
        },
      ])
      return api.get('/programs/bogus/badges')
    }).then(function (res) {
      t.same(res.statusCode, 404, 'should get a 404')
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })


  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
