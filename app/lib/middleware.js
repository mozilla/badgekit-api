module.exports = {
  findSystem: createFinder('system'),
  findIssuer: createFinder('issuer'),
}

const log = require('../lib/logger')
const restify = require('restify')
const models = {
  system: require('../models/system'),
  issuer: require('../models/issuer')
}

const http404 = restify.ResourceNotFoundError
const http500 = restify.InternalError

function createFinder(modelName) {
  return function findModel(opts) {
    opts = opts || {}
    const param = opts.param || modelName + 'Slug'
    const key = opts.key || modelName
    const relationships = typeof opts.relationships !== 'undefined'
      ? opts.relationships
      : false
    return function finder(req, res, next) {
      const slug = req.params[param]
      const query = {slug: slug}
      const opts = {relationships: relationships}
      models[modelName].getOne(query, opts, function (error, issuer) {
        if (error) {
          log.error(error)
          return next(new http500('An internal error occured'))
        }
        if (!issuer) {
          log.warn({code: 'ResourceNotFound', model: modelName, slug: slug})
          return next(new http404('Could not find '+modelName+' `'+slug+'`'))
        }
        req[key] = issuer
        return next()
      })
    }
  }
}
