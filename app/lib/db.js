var streamsql = require('streamsql');
var mysql = require('mysql');
var config = require('./config');


function getDbConfig (prefix) {
  prefix = prefix || 'DATABASE';
  prefix += '_';
  return {
    driver:     config(prefix+'DRIVER', 'mysql'),
    host:       config(prefix+'HOST', 'localhost'),
    user:       config(prefix+'USER'),
    password:   config(prefix+'PASSWORD'),
    database:   config(prefix+'DATABASE')
  };
}

var db = streamsql.connect(getDbConfig());

db.getDbConfig = getDbConfig;

function handleDisconnect() {
  db.connection = mysql.createConnection(options);
  db.connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    db.query = db.driver.getQueryFn(db.connection);
    db.queryStream = db.driver.getStreamFn(db.connection);
  });

  setErrorHandler();
}

function setErrorHandler() {
  db.connection.on('error', function(err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    }
    else {
      console.error(err);
    }
  });
}

setErrorHandler();

exports = module.exports = db;
