const Promise = require('bluebird')
const util = require('util')
const unixtimeFromDate = require('../lib/unixtime-from-date')
const sha256 = require('../lib/hash').sha256
const Badges = require('../models/badge')
const ClaimCodes = require('../models/claim-codes')
const Webhooks = require('../models/webhook')
const BadgeInstances = require('../models/badge-instance')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const log = require('../lib/logger')

const findSystemBadge = [
  middleware.findSystem(),
  middleware.findBadge({
    relationships: true,
    where: {systemId: ['system', 'id']},
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
    },
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
    },
  }),
]

const prefix = {
  system: '/systems/:systemSlug',
  issuer: '/systems/:systemSlug/issuers/:issuerSlug',
  program: '/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug',
}
const publicPrefix = {
  system: '/public/' + prefix.system,
  issuer: '/public/' + prefix.issuer,
  program: '/public/' + prefix.program,
}

exports = module.exports = function applyBadgeRoutes (server) {
  const createNewInstanceSuffix = '/badges/:badgeSlug/instances'
  server.post(prefix.system + createNewInstanceSuffix,
              findSystemBadge, createNewInstance)

  server.post(prefix.issuer + createNewInstanceSuffix,
              findIssuerBadge, createNewInstance)

  server.post(prefix.program + createNewInstanceSuffix,
              findProgramBadge, createNewInstance)

  function createNewInstance(req, res, next) {
    const row = BadgeInstances.formatUserInput(req.body)
    row.badgeId = req.badge.id

    const errs = BadgeInstances.validateRow(row)
    if (errs.length)
      return res.send(400, errorHelper.validation(errs));

    if (!row.claimCode)
      return saveBadgeInstance()

    function errorHandler(err) {
      log.error(err, 'error interacting with database in route for creating a new badge instance')
      return next(err)
    }

    const query = {
      code: row.claimCode,
      badgeId: row.badgeId
    }

    ClaimCodes.getOne(query).then(function (code) {
      if (code.claimed && !code.multiuse) {
        const response = {
          code: 'CodeAlreadyUsed',
          message: 'Claim code `'+code.code+'` has already been claimed'
        }
        res.send(400, response)
        return Promise.reject(response)
      }
      code.claimed = true
      code.email = row.email
      return ClaimCodes.put(code)
    }).then(saveBadgeInstance)
      .error(function (err) {
        if (err.code !== 'CodeAlreadyUsed')
          return errorHandler(err)
      })

    function saveBadgeInstance(err) {
      var hookData, system
      BadgeInstances.put(row).then(function (result) {
        const instance = result.row
        var responseInstance = BadgeInstances.toResponse(instance, req);

        res.header('Location', '/public/assertions/' + row.slug)
        res.send(201, {
          status: 'created',
          instance: responseInstance,
        })

        // Webhook stuff shouldn't hold up the request, so we call
        // `next()` before looking up any hooks we have to send off
        next()

        const system = req.system
        const comment = req.body.comment || null;
        hookData = {
          action: 'award',
          uid: instance.slug,
          badge: req.badge.toResponse(),
          email: instance.email,
          assertionUrl: responseInstance.assertionUrl,
          issuedOn: unixtimeFromDate(instance.issuedOn),
          evidenceUrl: instance.evidenceUrl,
          comment: comment
        }
        return Webhooks.getOne({systemId: system.id})
      }).then(function (hook) {
        if (!hook)
          return log.info({code: 'WebhookNotFound', system: system}, 'Webhook not found for system')

        hook.call(hookData, function (err, res, body) {
          if (err)
            return log.warn({code: 'WebhookRequestError', error: err})
          if (res.statusCode != 200)
            return log.warn({code: 'WebhookBadResponse', status: res.statusCode, body: body})
        })
      }).error(function (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          BadgeInstances.getOne({email: row.email, badgeId: req.badge.id}).then(function (instance) {
            const otherAssertionUrl = req.resolvePath('/public/assertions/' + instance.slug);
            return res.send(409, {code: 'ResourceConflict', message: 'User ' + row.email + ' has already been awarded badge ' + req.badge.slug, details: { assertionUrl: otherAssertionUrl }});
          })
          .error(function (err) {
            log.error(err, 'error fetching pre-existing badge instance');
          })
        }
        else {
          log.error(err, 'error dealing with webhooks when awarding badge')
        }
      })
    }
  }

  const getUserInstancesSuffix = '/instances/:email'
  server.get(prefix.system + getUserInstancesSuffix, [
    middleware.findSystem(),
    getUserInstances
  ]);
  server.get(prefix.issuer + getUserInstancesSuffix, [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    getUserInstances
  ]);
  server.get(prefix.program + getUserInstancesSuffix, [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    getUserInstances
  ]);
  function getUserInstances(req, res, next) {
    const email = req.params.email;
    const systemId = req.system ? req.system.id : null;
    const issuerId = req.issuer ? req.issuer.id : null;
    const programId = req.program ? req.program.id : null;

    const query = 'SELECT i.`id` FROM $table i'
               +  ' INNER JOIN `badges` b ON b.`id`=i.`badgeId`'
               +  ' WHERE i.`email` = ?'
               +  ' AND b.`systemId` = ?';

    const queryParams = [email, systemId];

    if (req.issuer) {
      query += ' AND b.`issuerId` = ?';
      queryParams.push(issuerId);
    }

    if (req.program) {
      query += ' AND b.`programId` = ?';
      queryParams.push(programId);
    }

    BadgeInstances.get([query, queryParams]).then(function (rows) {
      var instanceIds = rows.map(function(row) { return row.id; });
      return BadgeInstances.get( { id: instanceIds }, { relationships: true, relationshipsDepth: 2 });
    }).then(function (rows) {
      res.send({instances: rows.map(function (row) { return BadgeInstances.toResponse(row, req); })});
    }).error(function (err) {
      if (!err.restCode)
        log.error(err, 'unknown error in getUserInstances route')
      return next(err)
    });
  }

  server.get('/public/assertions/:instanceSlug', getAssertion)
  function getAssertion(req, res, next) {
    const data = {}
    const instanceSlug = req.params.instanceSlug
    const query = {slug: instanceSlug}
    const options = {relationships: true}
    BadgeInstances.getOne(query, options).then(function (instance) {
      if (!instance)
        return Promise.reject(errorHelper.notFound('Could not find badge instance'))

      data.instance = instance
      // get fully hydrated badge class
      const query = {id: instance.badge.id}
      const options = {relationships: true}
      return Badges.getOne(query, options)
    }).then(function (badge) {
      const instance = data.instance
      instance.badge = badge
      const assertion = makeAssertion(instance, req)
      res.send(200, assertion)
      return next()
    }).error(function (err) {
      if (!err.restCode)
        log.error(err, 'unknown error in assertion route')
      return next(err)
    })
  }
  function makeAssertion(instance, req) {
    const badge = instance.badge
    return {
      uid: instance.slug,
      recipient: {
        identity: 'sha256$' + sha256(instance.email),
        type: 'email',
        hashed: true,
      },
      badge: req.resolvePath(makeBadgeClassUrl(badge)),
      verify: {
        url: req.resolvePath('/public/assertions/' + instance.slug),
        type: 'hosted',
      },
      issuedOn: unixtimeFromDate(instance.issuedOn),
      expires: unixtimeFromDate(instance.expires),
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
              findSystemBadge, getBadgeClass)

  server.get(publicPrefix.issuer +'/badges/:badgeSlug',
              findIssuerBadge, getBadgeClass)

  server.get(publicPrefix.program+'/badges/:badgeSlug',
              findProgramBadge, getBadgeClass)
  function getBadgeClass(req, res, next) {
    const badgeClass = makeBadgeClass(req.badge, req)
    res.send(200, badgeClass)
    return next()
  }
  function makeBadgeClass(badge, req) {
    // #TODO: alignment urls, tags
    var imageUrl = badge.image.toUrl()
    if (!/^http/.test(imageUrl))
      imageUrl = req.resolvePath(imageUrl)
    return {
      name: badge.name,
      description: badge.consumerDescription,
      image: badge.image.toUrl(),
      criteria: badge.criteriaUrl,
      issuer: req.resolvePath(publicIssuerUrl(badge)),
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
    getIssuerClass,
  ])
  server.get('/public/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({
      relationships: true,
      where: {systemId: ['system', 'id']},
    }),
    getIssuerClass,
  ])
  server.get('/public/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({
      relationships: true,
      where: {issuerId: ['issuer', 'id']},
    }),
    getIssuerClass,
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
}
