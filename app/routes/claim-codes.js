const ClaimCodes = require('../models/claim-codes')
const middleware = require('../lib/middleware')
const errorHelper = require('../lib/error-helper')

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
  function createNewCode (input, req, res) {
    const row = ClaimCodes.fromUserInput(input)
    const badge = req.badge.toResponse()
    row.badgeId = badge.id

    var validationErrors = ClaimCodes.validateRow(row);
    if (validationErrors.length)
      return res.send(400, errorHelper.validation(validationErrors));

    ClaimCodes
      .put(row)
      .then(function (result) {
        result.row.id = result.insertId
        const claimCode = ClaimCodes.toResponse(result.row)

        res.send(201, {
          status: 'created',
          claimCode: claimCode,
          badge: badge,
        })
      })
      .error(req.error('Error inserting claim code'))
  }


  server.post(prefix.system + '/codes', findSystemBadge, addNewCode)
  server.post(prefix.issuer + '/codes', findIssuerBadge, addNewCode)
  server.post(prefix.program + '/codes', findProgramBadge, addNewCode)

  function addNewCode(req, res, next) {
    createNewCode(req.body, req, res);
  }


  server.post(prefix.system + '/codes/random',
             findSystemBadge, makeRandomCode)
  server.post(prefix.issuer + '/codes/random',
             findIssuerBadge, makeRandomCode)
  server.post(prefix.program + '/codes/random',
             findProgramBadge, makeRandomCode)

  function makeRandomCode(req, res, next) {
    const data = req.body || {}
    data.code = ClaimCodes.makeRandom(10)

    createNewCode(data, req, res)
  }


  server.get(prefix.system + '/codes', findSystemBadge, getBadgeCodes)
  server.get(prefix.issuer + '/codes', findIssuerBadge, getBadgeCodes)
  server.get(prefix.program + '/codes',findProgramBadge, getBadgeCodes)

  function getBadgeCodes(req, res, next) {
    const query = {badgeId: req.badge.id}
    const options = {relationships: false}

    ClaimCodes
      .get(query, options)
      .then(function (claimCodes) {
        res.send(200, {
          claimCodes: claimCodes.map(ClaimCodes.toResponse),
          badge: req.badge.toResponse(),
        })
      })
      .error(req.error('Error getting claim code list'))
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
        const claimCode = result.row.toResponse()

        res.send(200, {
          status: 'updated',
          claimCode: claimCode,
          badge: req.badge.toResponse(),
        })
      })
      .error(req.error('Error updating claim code to claimed'))
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
      claimCode: req.claimCode.toResponse(),
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
          claimCode: code.toResponse(),
          badge: req.badge.toResponse(),
        })
      })
      .error(req.error('Error deleting claim code'))
  }
}
