var restify = require('restify');
var applyRoutes = require('./routes');

var server = restify.createServer({
  name: 'openbadger',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false, rejectUnknown: true}));

applyRoutes(server);

module.exports = server;

if (!module.parent) {
  server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}
