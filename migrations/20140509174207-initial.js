var dbm = require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var async = require('async');

/*
Rather than rewrite the initial schema, I'm cheating and just running it as the
first migration. Breaking it up into sql statements, then running them in sequence.
*/
exports.up = function(db, callback) {
  var sql = fs.createReadStream('./schema.sql', { encoding:'utf-8' });
  var statement = "";
  var statements = [];
  sql.on('readable', function(chunk) {
    while (null !== (chunk = sql.read(1))) {
      statement += chunk;
      if (chunk == ';') {
        statements.push(statement);
        statement = "";
      }
    };
  });

  sql.on('end', function() {
    async.each(statements, function(sqlStatement, done) {
      db.runSql(sqlStatement);
      done();
    }, callback);
  });
};

exports.down = function(db, callback) {

};
