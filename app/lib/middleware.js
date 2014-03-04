module.exports = {
  findSystem: createFinder('system'),
  findIssuer: createFinder('issuer'),
  findProgram: createFinder('program'),
  findBadge: createFinder('badge'),
  verifyRequest: verifyRequest,
}

const jws = require('jws')
const crypto = require('crypto')
const restify = require('restify')
const log = require('../lib/logger')
const models = {
  system: require('../models/system'),
  issuer: require('../models/issuer'),
  program: require('../models/program'),
  badge: require('../models/badge'),
  consumer: require('../models/consumer')
}

const http403 = restify.NotAuthorizedError
const http404 = restify.ResourceNotFoundError
const http500 = restify.InternalError

function createFinder(modelName) {
  return function findModel(opts) {
    opts = opts || {}
    const param = opts.param || modelName + 'Slug'
    const key = opts.key || modelName
    const where = opts.where || {}
    const relationships = typeof opts.relationships !== 'undefined'
      ? opts.relationships
      : false
    return function finder(req, res, next) {
      const slug = req.params[param]
      const query = makeQuery(req, where, {slug: slug})
      const opts = {relationships: relationships}
      models[modelName].getOne(query, opts, function (error, item) {
        if (error) {
          log.error(error)
          return next(new http500('An internal error occured'))
        }
        if (!item) {
          log.warn({code: 'ResourceNotFound', model: modelName, slug: slug})
          return next(new http404('Could not find '+modelName+' `'+slug+'`'))
        }
        req[key] = item
        return next()
      })
    }
  }
}

function makeQuery(req, where, query) {
  return Object.keys(where).reduce(function (query, key) {
    const clause = where[key]
    const value = clause.reduce(function (obj, field) {
      return obj[field]
    }, req)
    query[key] = value
    return query
  }, query)
}

function verifyRequest() {
  if (process.env.NODE_ENV == 'test') {
    log.warn('In test environment, bypassing request verification')
    return function (req, res, next) {
      return next()
    }
  }

  return function (req, res, next) {
    if (req.url.indexOf('/public/') === 0)
      return next()

    const token = getAuthToken(req)
    if (!token)
      return next(new http403('Missing valid Authorization header'))

    try {
      const parts = jws.decode(token) }
    catch (e) {
      log.warn({code: 'JWTDecodeError', token: token}, 'Could not decode JWT')
      return next(new http403('Could not decode JWT'))
    }

    const auth = parts.payload
    if (!auth)
      return next(new http403('Missing JWT payload'))

    if (!auth.method)
      return next(new http403('Missing JWT claim: method'))

    if (''+auth.method.toUpperCase() !== req.method.toUpperCase())
      return next(new http403('`method` does not match: using "'+auth.method+'" token for "'+req.method+'" request'))

    if (!auth.path)
      return next(new http403('Missing JWT claim: path'))

    if (auth.path !== req.url)
      return next(new http403('`path` does not match: trying to use token for "'+auth.path+'" on "'+req.url+'"'))

    const now = Date.now()/1000|0
    if (auth.exp && auth.exp <= now)
      return next(new http403('Token is expired (token expiry: '+auth.exp+', server time: '+now))

    if (!(/^(GET|DELETE|HEAD)$/i.exec(req.method))) {
      if (!auth.body)
        return next(new http403('Missing JWT claim: body'))

      if (!auth.body.alg)
        return next(new http403('Missing JWT claim: body.alg'))

      if (!auth.body.hash)
        return next(new http403('Missing JWT claim: body.hash'))

      const givenHash = auth.body.hash
      try {
        const computedHash = hash(auth.body.alg, req._body)
      } catch (e) {
        return next(new http403('Could not calculate hash, unsupported algorithm: '+auth.body.alg))
      }
      if (givenHash !== computedHash)
        return next(new http403('Computed hash does not match given hash: '+givenHash+' != '+computedHash+''))
    }

    if (!auth.key)
      return next(new http403('Missing JWT claim: key'))

    if (auth.key === 'master') {
      const masterSecret = process.env.MASTER_SECRET
      if (!jws.verify(token, masterSecret))
        return next(new http403('Invalid token signature'))
      return success()
    }

    models.consumer.findByKey(auth.key, function (err, consumer) {
      if (!consumer)
        return next(new http403('Could not find consumer for API key'))

      const requestSystemSlug = req.params.systemSlug
      if (!requestSystemSlug || consumer.system.slug !== requestSystemSlug)
        return next(new http403('Invalid token for system'))

      if (!jws.verify(token, consumer.apiSecret))
        return next(new http403('Invalid token signature'))
      return success()
    })

    function success() { next() }
  }
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) return

  const match = authHeader.match(/^JWT token="(.+?)"$/)
  if (!match) return

  return match[1]
}

function hash(alg, body) {
  return crypto.createHash(alg).update(body).digest('hex')
}
