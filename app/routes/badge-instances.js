const Badges = require('../models/badge')
const BadgeInstances = require('../models/badge-instance')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const log = require('../lib/logger')

const findSystemBadge = [
  middleware.findSystem(),
  middleware.findBadge({
    relationships: true,
    where: {systemId: ['system', 'id']}
  }),
]
const findIssuerBadge = [
  middleware.findSystem(),
  middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  middleware.findBadge({
    relationships: true,
    where: {
      systemId: ['system', 'id'],
      issuerId: ['issuer', 'id'],
    }
  }),
]
const findProgramBadge = [
  middleware.findSystem(),
  middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
  middleware.findBadge({
    relationships: true,
    where: {
      systemId: ['system', 'id'],
      issuerId: ['issuer', 'id'],
      programId: ['program', 'id'],
    }
  }),
]

const prefix = {
  system: '/systems/:systemSlug',
  issuer: '/systems/:systemSlug/issuers/:issuerSlug',
  program: '/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug'
}

exports = module.exports = function applyBadgeRoutes (server) {
  server.post(prefix.system +'/badges/:badgeSlug/instances',
              findSystemBadge.concat([createNewInstance]))

  server.post(prefix.issuer +'/badges/:badgeSlug/instances',
              findIssuerBadge.concat([createNewInstance]))

  server.post(prefix.program+'/badges/:badgeSlug/instances',
              findProgramBadge.concat([createNewInstance]))

  function createNewInstance(req, res, next) {
    const row = BadgeInstances.formatUserInput(req.body)
    row.badgeId = req.badge.id

    const errs = BadgeInstances.validateRow(row)
    if (errs.length)
      return res.send(400, errorHelper.validation(errs));

    BadgeInstances.put(row, function (err, result) {
      if (err) {
        log.error(err, 'error trying to save badge instance')
        return next(err)
      }

      const url = '/public/assertions/' + result.row.slug
      res.header('Location', url)
      res.send(201, {
        status: 'created',
        location: url,
      })

      return next()
    })
  }

  server.get('/public/assertions/:instanceSlug', getAssertion)
  function getAssertion(req, res, next) {
    const instanceSlug = req.params.instanceSlug
    const query = {slug: instanceSlug}
    const options = {relationships: true}
    BadgeInstances.getOne(query, options, function (err, instance) {
      if (!instance)
        return next(errorHelper.notFound('Could not find badge instance'))
      const assertion = BadgeInstances.makeAssertion(instance)
      res.send(200, assertion)
      return next()
    })
  }

  server.get('/public/badges/:badgeKey', getBadgeClass)
  function getBadgeClass(req, res, next) {
    const badgeKey = req.params.badgeKey
    const match = /(\d+)-(.+)/.exec(badgeKey)
    if (!match)
      return next(errorHelper.notFound('Could not find badge'))

    const badgeId = match[1]
    const badgeSlug = match[2]

    const query = {id: badgeId, slug: badgeSlug}
    const options = {relationships: true}
    Badges.getOne(query, options, function (err, badge) {
      const badgeClass = Badges.makeBadgeClass(badge)
      res.send(200, badgeClass)
      return next()
    })
  }

  server.get('/public/systems/:systemSlug', [
    middleware.findSystem({relationships: true}),
    getIssuerClass
  ])
  server.get('/public/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({
      relationships: true,
      where: {systemId: ['system', 'id']}
    }),
    getIssuerClass
  ])
  server.get('/public/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({
      relationships: true,
      where: {issuerId: ['issuer', 'id']}
    }),
    getIssuerClass
  ])
  function getIssuerClass(req, res, next) {
    return res.send(200, makeIssuerOrganization(
      req.program, req.issuer, req.system
    ))
  }
  function makeIssuerOrganization(program, issuer, system) {
    program = program || {}
    issuer = issuer || {}
    system = system || {}
    return {
      name: program.name || issuer.name || system.name,
      url: program.url || issuer.url || system.url,
      description: program.description || issuer.description || system.description,
      email: program.email || issuer.email || system.email,
    }
  }

  // server.get(prefix.system +'/badges/:badgeSlug/instances', [
  //   middleware.findSystem(),
  // ])
  // server.get(prefix.issuer +'/badges/:badgeSlug/instances', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  // ])
  // server.get(prefix.program+'/badges/:badgeSlug/instances', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  //   middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
  // ])

  // server.get(prefix.system +'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  // ])
  // server.get(prefix.issuer +'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  // ])
  // server.get(prefix.program+'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  //   middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
  // ])

  // server.del(prefix.system +'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  // ])
  // server.del(prefix.issuer +'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  // ])
  // server.del(prefix.program+'/badges/:badgeSlug/instances/:instanceId', [
  //   middleware.findSystem(),
  //   middleware.findIssuer({where: {systemId: ['system', 'id']}}),
  //   middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
  // ])
}
