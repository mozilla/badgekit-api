const Promise = require('bluebird')
const Milestones = require('../models/milestone');
const MilestoneBadges = require('../models/milestone-badge')
const middleware = require('../lib/middleware');
const errorHelper = require('../lib/error-helper')

exports = module.exports = function applyBadgeRoutes(server) {
  server.get('/systems/:systemSlug/milestones', [
    middleware.findSystem(),
    showAllMilestones,
  ]);
  function showAllMilestones(req, res, next) {
    const query = { systemId: req.system.id };
    const options = { relationships: true };
    Milestones.get(query, options)
      .then(function (milestones) {
        return res.send(200, {
          milestones: milestones.map(Milestones.toResponse)
        });
      })
      .catch(handleError(req, next));
  }

  server.post('/systems/:systemSlug/milestones', [
    middleware.findSystem(),
    saveMilestone,
  ]);
  function saveMilestone(req, res, next) {
    const postData = req.body;
    const row = {
      systemId: req.system.id,
      numberRequired: postData.numberRequired,
      primaryBadgeId: postData.primaryBadgeId,
      action: postData.action,
    };

    if (!row.action)
      delete row.action;

    const errors = Milestones.validateRow(row);
    if (errors.length)
      return res.send(400, errorHelper.validation(errors));

    var milestoneId;
    Milestones.put(row)
      .then(function (result) {
        milestoneId = result.insertId;
        return Promise.map(postData.supportBadges, function (badgeId) {
          return MilestoneBadges.put({
            milestoneId: milestoneId,
            badgeId: badgeId,
          });
        });
      })
      .then(function (results) {
        const query = { id: milestoneId };
        const options = { relationships: true };

        return Milestones.getOne(query, options);
      })
      .then(function (milestone) {
        return res.send(201, {
          status: 'created',
          milestone: milestone.toResponse()
        });
      })
      .catch(handleError(req, next));
  }

  server.get('/systems/:systemSlug/milestones/:milestoneId', [
    middleware.findSystem(),
    showMilestone,
  ]);
  function showMilestone(req, res, next) {
    const query = {
      id: req.params.milestoneId,
      systemId: req.system.id
    };
    const options = { relationships: true };
    Milestones.getOne(query, options)
      .then(function (milestone) {
        return res.send(200, {
          milestone: milestone.toResponse()
        });
      })
      .catch(handleError(req, next));
  }


}

function handleError(req, next) {
  return function (err) {
    req.log.error(err);
    return next(err);
  };
}
