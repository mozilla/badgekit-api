const ClaimCodes = require('../models/claim-codes')
const middleware = require('../lib/middleware')
const log = require('../lib/logger')

// #TODO: factor this out, see ./badge-instances.js

const prefix = {
  system: '/systems/:systemSlug/badges/:badgeSlug',
  issuer: '/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug',
  program: '/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug'
}

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

const claimCodeFinder = middleware.findClaimCode({
  field: 'code',
  param: 'code',
  where: {badgeId: ['badge', 'id']}
})

exports = module.exports = function applyClaimCodesRoutes (server) {
  server.post(prefix.system + '/codes',
              findSystemBadge.concat([addNewCode]))
  server.post(prefix.issuer + '/codes',
              findIssuerBadge.concat([addNewCode]))
  server.post(prefix.program + '/codes',
              findProgramBadge.concat([addNewCode]))

  function addNewCode(req, res, next) {
    const row = ClaimCodes.fromUserInput(req.body)
    row.badgeId = req.badge.id
    ClaimCodes.put(row, function (err, result) {
      if (err) {
        log.error(err, 'Error inserting claim code')
        return next(err)
      }
      const claimCode = result.row
      res.send(201, {
        status: 'created',
        claimCode: claimCode,
      })
    })
  }


  server.get(prefix.system + '/codes',
             findSystemBadge.concat([getBadgeCodes]))
  server.get(prefix.issuer + '/codes',
             findIssuerBadge.concat([getBadgeCodes]))
  server.get(prefix.program + '/codes',
             findProgramBadge.concat([getBadgeCodes]))

  function getBadgeCodes(req, res, next) {
    const query = {badgeId: req.badge.id}
    const options = {relationships: false}
    ClaimCodes.get(query, options, function (err, claimCodes) {
      if (err) {
        log.error(err, 'Error getting claim code list')
        return next(err)
      }
      res.send(200, {
        claimCodes: claimCodes,
        badge: req.badge.toResponse(),
      })
      return next()
    })
  }


  server.post(prefix.system + '/codes/:code/claim',
             findSystemBadge.concat([claimCodeFinder, claim]))
  server.post(prefix.issuer + '/codes/:code/claim',
             findIssuerBadge.concat([claimCodeFinder, claim]))
  server.post(prefix.program + '/codes/:code/claim',
             findProgramBadge.concat(claimCodeFinder, [claim]))

  function claim(req, res, next) {
    const code = req.claimCode
    if (code.claimed) {
      res.send(400, {
        code: 'CodeAlreadyUsed',
        message: 'Claim code `'+code.code+'` has already been claimed'
      })
      return next()
    }

    code.claimed = true
    code.email = req.body.email

    ClaimCodes.put(code, function (err, result) {
      if (err) {
        log.error(err, 'Error updating claim code to claimed')
        return next(err)
      }
      res.send(200, {
        status: 'updated',
        claimCode: code,
      })
    })
  }

}
