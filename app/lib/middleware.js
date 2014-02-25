module.exports = {
  findSystem: createFinder('system'),
  findIssuer: createFinder('issuer'),
  findProgram: createFinder('program'),
  findBadge: createFinder('badge'),
}

const log = require('../lib/logger')
const restify = require('restify')
const models = {
  system: require('../models/system'),
  issuer: require('../models/issuer'),
  program: require('../models/program'),
  badge: require('../models/badge'),
}

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
