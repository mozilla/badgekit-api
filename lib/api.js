const restify = require('restify');

function API (config) {
  config || (config = {});

  if (!isAPI(this))
    return new API(config);

  Object.keys(config).forEach(function (key) {
    var isSingular = key.split('').pop() !== 's';
    Object.defineProperty(this, key, {
      __proto__: null,
      enumerable: true,
      value: wrap(config[key], isSingular)
    })
  }.bind(this));

  Object.defineProperty(this, 'serve', {
    __proto__: null,
    value: serve
  });
}

API.prototype.append = function (api) {
  if (!isAPI(api))
    throw new TypeError('Expecting API instance');

  Object.keys(api).forEach(function (key) {
    if (this[key]) return;

    Object.defineProperty(this, key, {
      __proto__: null,
      enumerable: true,
      value: api[key]
    });
  }.bind(this));

  return this;
}

function serve (routes) {
  var server = restify.createServer();
  var listen = server.listen;
  var api = this;

  if (typeof routes === 'string')
    routes = require(routes);
  routes = routes || {};

  server.use(restify.queryParser({mapParams: false}));
  server.use(restify.bodyParser({mapParams: false}));

  server.listen = function () {
    Object.keys(routes).forEach(function(path) {
      var config = routes[path];
      Object.keys(config).forEach(function(verb) {
        if (typeof api[config[verb]] !== 'function') {
          console.warn('Unable to establish route: ' + verb + ':/' + path + '. Method `' + config[verb] + '` not found.');
          return;
        }

        var method = api[config[verb]],
            signature = method.signature,
            singleton = method.singleton;

        server[verb](path, function (req, res, next) {
          var args = signature.slice(0).reduce(function(args, param) {
            if (param === '$data')
              args.push(req.body);
            else
              args.push(req.params[param]);
            return args;
          }, []);

          var stream = method.apply(api, args);
          var started = false;
          stream.on('error', function (err) {
            next(new restify.RestError(err));
          });
          stream.on('data', function (item) {
            if (!started)
              res.write('{"code":"OK","data":' + (singleton ? '' : '['));
            else
              res.write(',');
            started = true;
            res.write(JSON.stringify(item));
          });
          stream.on('end', function () {
            res.end((singleton ? '' : ']') + '}');
          });
        });
      })
    });

    listen.apply(server, arguments);
  }

  return server;
}

function wrap (fn, singular) {
  var params = getParams(fn);

  var wrapper = function () {
    var args = Array.prototype.slice.call(arguments),
        callback = args[params.length],
        args = args.slice(0, params.length);

    var stream = fn.apply(this, args);

    if (typeof callback !== 'function')
      return stream;

    var done = false;
    var data = [];

    function finished (err, data) {
      if (done) return;
      done = true;

      if (err)
        return callback(err);

      callback(null, singular ? data[0] : data);
    }

    stream.on('data', function (item) {
      data.push(item);
    });

    stream.on('end', function () {
      finished(null, data);
    });

    stream.on('error', function (err) {
      finished(err);
    });
  }

  wrapper.signature = params;
  wrapper.singleton = singular;

  return wrapper;
}

function getParams (fn) {
  return /^\s*function\s*?(?:\s+[^(]+\s*)?\((.*?)\)/.exec(''+fn)[1].split(/,\s*/);
}

function isAPI (obj) {
  return obj instanceof API;
}

exports = module.exports = API;
