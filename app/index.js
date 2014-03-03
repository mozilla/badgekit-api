const restify = require('restify');
const applyRoutes = require('./routes');
const logger = require('./lib/logger')
const middleware = require('./lib/middleware')

const server = restify.createServer({
  name: 'openbadger',
  version: '1.0.0',
  log: logger,
});

server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false, rejectUnknown: true}));
server.use(middleware.verifyRequest())

applyRoutes(server);

module.exports = server;

if (!module.parent) {
  server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}
