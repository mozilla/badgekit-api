const Milestones = require('../models/milestone');
const middleware = require('../lib/middleware');

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

      .catch(function (err) {
        req.log.error(err);
        return next(err);
      });
  };
}
