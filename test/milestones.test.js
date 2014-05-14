const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')
const MilestoneBadges = require('../app/models/milestone-badge')

spawn(app).then(function (api) {
  test('Get all milestones', function (t) {
    api.get('/systems/chicago/milestones')
      .then(function (res) {
        t.same(res.statusCode, 200, '200 OK')
        t.ok(res.body.milestones.length >= 1, 'at least one milestone')
        t.end()
      })
      .catch(api.fail(t))
  })

  test('Get one milestone', function (t) {
    api.get('/systems/chicago/milestones/1')
      .then(function (res) {
        const milestone = res.body.milestone
        t.same(res.statusCode, 200, '200 OK')
        t.same(milestone.id, 1, 'has correct ID')
        t.same(milestone.primaryBadge.slug, 'chicago-badge', 'has correct primary badge')
        t.end()
      })
      .catch(api.fail(t))
  })

  test('Create a new milestone', function (t) {
    const postData = {
      systemId: 90,
      primaryBadgeId: 4,
      numberRequired: 1,
      supportBadges: [5, 1],
    }
    api.post('/systems/chicago/milestones', postData)
      .then(function (res) {
        t.same(res.statusCode, 201, '201 Created')
        t.ok(res.body.milestone, 'has milestone')
        const milestone = res.body.milestone
        const primaryBadge = milestone.primaryBadge
        const supportBadges =
          milestone.supportBadges.map(function (o) {
            return o.id
          }).sort()
        t.same(supportBadges, [1, 5], 'has 2 support badges')
        t.same(primaryBadge.id, 4, 'has correct primary badge')
        t.end()
      })
      .catch(api.fail(t))
  })

  test('Delete a milestone', function (t) {
    api.del('/systems/chicago/milestones/999')
      .then(function (res) {
        t.same(res.statusCode, 200, '200 OK')
        t.same(res.body.status, 'deleted', 'has status `deleted`')
        return MilestoneBadges.get({milestoneId: 999})
      })
      .then(function (results) {
        t.same(results.length, 0, 'no milestone badges for deleted milestone')
        return api.del('/systems/chicago/milestones/999')
      })
      .then(function (res) {
        t.same(res.statusCode, 404, '404 Not Found')
        t.end()
      })
      .catch(api.fail(t))
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
