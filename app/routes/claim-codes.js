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
              findSystemBadge, addNewCode)
  server.post(prefix.issuer + '/codes',
              findIssuerBadge, addNewCode)
  server.post(prefix.program + '/codes',
              findProgramBadge, addNewCode)

  function addNewCode(req, res, next) {
    const row = ClaimCodes.fromUserInput(req.body)
    row.badgeId = req.badge.id

    ClaimCodes
      .put(row)
      .then(function (result) {
        const claimCode = result.row
        res.send(201, {
          status: 'created',
          claimCode: claimCode,
        })
      })
      .error(function (err) {
        log.error(err, 'Error inserting claim code')
        next(err)
      })
  }


  server.get(prefix.system + '/codes',
             findSystemBadge, getBadgeCodes)
  server.get(prefix.issuer + '/codes',
             findIssuerBadge, getBadgeCodes)
  server.get(prefix.program + '/codes',
             findProgramBadge, getBadgeCodes)

  function getBadgeCodes(req, res, next) {
    const query = {badgeId: req.badge.id}
    const options = {relationships: false}

    ClaimCodes
      .get(query, options)
      .then(function (claimCodes) {
        res.send(200, {
          claimCodes: claimCodes,
          badge: req.badge.toResponse(),
        })
      })
      .error(function (err) {
        log.error(err, 'Error getting claim code list')
        next(err)
      })
  }

  server.post(prefix.system + '/codes/random',
             findSystemBadge, makeRandomCode)
  server.post(prefix.issuer + '/codes/random',
             findIssuerBadge, makeRandomCode)
  server.post(prefix.program + '/codes/random',
             findProgramBadge, makeRandomCode)

  function makeRandomCode(req, res, next) {
    const row = {code: ClaimCodes.makeRandom(10)}
    ClaimCodes
      .put(row)
      .then(function (result) {
        const claimCode = result.row
        res.send(201, {
          status: 'created',
          claimCode: claimCode,
        })
      })
      .error(function (err) {
        log.error(err, 'Error inserting claim code')
        next(err)
      })
  }


  server.post(prefix.system + '/codes/:code/claim',
             findSystemBadge, [claimCodeFinder, claim])
  server.post(prefix.issuer + '/codes/:code/claim',
             findIssuerBadge, [claimCodeFinder, claim])
  server.post(prefix.program + '/codes/:code/claim',
             findProgramBadge, [claimCodeFinder, claim])

  function claim(req, res, next) {
    const code = req.claimCode
    if (code.claimed && !code.multiuse) {
      res.send(400, {
        code: 'CodeAlreadyUsed',
        message: 'Claim code `'+code.code+'` has already been claimed'
      })
      return next()
    }

    code.claimed = true
    code.email = req.body.email

    ClaimCodes
      .put(code)
      .then(function (result) {
        res.send(200, {
          status: 'updated',
          claimCode: code,
        })
      })
      .error(function (err) {
        log.error(err, 'Error updating claim code to claimed')
        next(err)
      })
  }

  server.get(prefix.system + '/codes/:code',
             findSystemBadge, [claimCodeFinder, getCode])
  server.get(prefix.issuer + '/codes/:code',
             findIssuerBadge, [claimCodeFinder, getCode])
  server.get(prefix.program + '/codes/:code',
             findProgramBadge, [claimCodeFinder, getCode])

  function getCode(req, res, next) {
    res.send(200, {
      badge: req.badge.toResponse(),
      claimCode: req.claimCode,
    })
  }


  server.del(prefix.system + '/codes/:code',
             findSystemBadge, [claimCodeFinder, deleteCode])
  server.del(prefix.issuer + '/codes/:code',
             findIssuerBadge, [claimCodeFinder, deleteCode])
  server.del(prefix.program + '/codes/:code',
             findProgramBadge, [claimCodeFinder, deleteCode])

  function deleteCode(req, res, next) {
    const code = req.claimCode
    const badgeId = req.badge.id
    const query = {id: code.id, badgeId: badgeId}

    ClaimCodes
      .del(query)
      .then(function (result) {
        res.send(200, {
          status: 'deleted',
          claimCode: code,
        })
      })
      .error(function (err) {
        log.error(err, 'Error deleteing claim code')
        next(err)
      })
  }
}
