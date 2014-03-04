const util = require('util')
const crypto = require('crypto')
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
const publicPrefix = {
  system: '/public/' + prefix.system,
  issuer: '/public/' + prefix.issuer,
  program: '/public/' + prefix.program,
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

      // get fully hydrated badge class
      const query = {id: instance.badge.id}
      const options = {relationships: true}
      Badges.getOne(query, options, function (err, badge) {
        if (err) return next(err)
        instance.badge = badge

        const assertion = makeAssertion(instance)
        res.send(200, assertion)
        return next()
      })
    })
  }
  function makeAssertion(instance) {
    const badge = instance.badge
    return {
      uid: instance.slug,
      recipient: {
        identity: 'sha256$' + sha256(instance.email),
        type: 'email',
        hashed: true,
      },
      badge: makeBadgeClassUrl(badge),
      verify: {
        url: '/public/assertions/' + instance.slug,
        type: 'hosted',
      },
      issuedOn: instance.issuedOn ? +instance.issuedOn/1000|0 : undefined,
      expires: instance.expires ? +instance.expires/1000|0 : undefined,
    }
  }
  function makeBadgeClassUrl(badge) {
    const badgeSlug = badge.slug
    const programSlug = badge.program && badge.program.slug
    const issuerSlug = badge.issuer && badge.issuer.slug
    const systemSlug = badge.system && badge.system.slug

    if (programSlug && issuerSlug && systemSlug)
      return util.format('/public/systems/%s/issuers/%s/programs/%s/badges/%s',
                        systemSlug, issuerSlug, programSlug, badgeSlug)

    if (!programSlug && issuerSlug && systemSlug)
      return util.format('/public/systems/%s/issuers/%s/badges/%s',
                        systemSlug, issuerSlug, badgeSlug)

    if (!programSlug && !issuerSlug && systemSlug)
      return util.format('/public/systems/%s/badges/%s',
                        systemSlug, badgeSlug)

    log.error({badge: badge}, 'badge has incomplete parantage – sending broken assertion')
    return '/public'
  }

  server.get(publicPrefix.system +'/badges/:badgeSlug',
              findSystemBadge.concat([getBadgeClass]))

  server.get(publicPrefix.issuer +'/badges/:badgeSlug',
              findIssuerBadge.concat([getBadgeClass]))

  server.get(publicPrefix.program+'/badges/:badgeSlug',
              findProgramBadge.concat([getBadgeClass]))
  function getBadgeClass(req, res, next) {
    const badgeClass = makeBadgeClass(req.badge)
    res.send(200, badgeClass)
    return next()
  }
  function makeBadgeClass(badge) {
    // #TODO: alignment urls, tags
    return {
      name: badge.name,
      description: badge.consumerDescription,
      image: badge.image.toUrl(),
      criteria: badge.criteriaUrl,
      issuer: publicIssuerUrl(badge),
    }
  }
  function publicIssuerUrl(badge) {
    const system = badge.system
    const issuer = badge.issuer
    const program = badge.program
    if (program && program.slug)
      return util.format('/public/systems/%s/issuers/%s/programs/%s',
                         system.slug, issuer.slug, program.slug)
    if (issuer && issuer.slug)
      return util.format('/public/systems/%s/issuers',
                         system.slug, issuer.slug)
    if (badge.system && badge.system.slug)
      return util.format('/public/systems/%s', system.slug)
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
    const lookup = findFirstKeyIn([program, issuer, system])
    return {
      name: lookup('name'),
      url: lookup('url'),
      description: lookup('description'),
      email: lookup('email'),
    }
  }
  function findFirstKeyIn(things) {
    things = things.map(function (o) { return o || {} })
    return function lookup(key) {
      for (var i = 0; i < things.length; i++)
        if (things[i][key]) return things[i][key]
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

function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex')
}
