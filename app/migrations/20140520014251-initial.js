var fs = require('fs')
var path = require('path')
var async = require('async')

exports.up = function(db, callback) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema
    .trim()
    .split(';')
    .map(function (s) {return s.trim()})
    .filter(Boolean);
  async.each(statements, db.runSql.bind(db), callback);
};

exports.down = function(db, callback) {
  db.runSql('SHOW TABLES', function (err, tableData) {
    const statements = ['SET `foreign_key_checks` = 0'];
    tableData.forEach(function (obj) {
      var table = obj[Object.keys(obj)[0]];
      if (table == 'migrations') return;
      statements.push('DROP TABLE `' + table + '`');
    })
    statements.push('SET `foreign_key_checks` = 1');
    async.each(statements, db.runSql.bind(db), callback);
  });
};
