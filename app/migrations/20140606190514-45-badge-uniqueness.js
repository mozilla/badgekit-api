var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async')

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "ALTER TABLE `badges` "
                   + "DROP KEY `slug_and_system`,"
                   + "DROP KEY `slug_and_issuer`,"
                   + "DROP KEY `slug_and_program`"),
    db.runSql.bind(db, "ALTER TABLE `badges` "
                   + "ADD UNIQUE KEY `slug` (`slug`)")
  ], callback)
};

exports.down = function(db, callback) {
    async.series([
      db.runSql.bind(db, "ALTER TABLE `badges` "
                     + "DROP KEY slug"),
      db.runSql.bind(db,"ALTER TABLE `issuers` "
                     + "ADD UNIQUE KEY `slug_and_system` (`slug`, `systemId`)"
      ),
      db.runSql.bind(db,"ALTER TABLE `badges` "
                     + "ADD UNIQUE KEY `slug_and_system` (`slug`, `systemId`), "
                     + "ADD UNIQUE KEY `slug_and_issuer` (`slug`, `issuerId`), "
                     + "ADD UNIQUE KEY `slug_and_program` (`slug`, `programId`) "
      )], callback);
};
