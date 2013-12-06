const api = require('./api');
const config = require('./lib/config');
const path = require('path');

if (module.parent) {

  module.exports = api;

} else {
  var port = config('PORT', 3000);

  api
    .serve(config('ROUTES', path.join(__dirname, './routes.json')))
    .listen(port, function (err) {
      if (err) throw err;
      console.log("Listening on port " + port + ".");
    });
}
