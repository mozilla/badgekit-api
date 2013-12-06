const EventEmitter = require('events').EventEmitter;
const Stream = require('stream');

function bind (obj, stream) {
  [Stream, EventEmitter].forEach(function (parent) {
    Object.keys(parent.prototype).forEach(function(key) {
      if (obj[key]) return;

      Object.defineProperty(obj, key, {
        __proto__: null,
        value: stream[key].bind(stream)
      });
    });
  });
}

function StreamableCallback () {
  var stream = new Stream();

  var callback = function (err, data) {
    process.nextTick(function() {
      if (err)
        return stream.emit('error', err);

      if (!(data instanceof Array))
        data = [data];

      data.forEach(function(item) {
        stream.emit('data', item);
      });

      stream.emit('end');
    });
  }

  bind(callback, stream);
  return callback;
}

exports = module.exports = StreamableCallback;
