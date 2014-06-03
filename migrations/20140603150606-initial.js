var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	exports.up = function(db, callback) {
  db.runSql("CREATE TABLE IF NOT EXISTS `systems` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "slug 			VARCHAR(255) NOT NULL UNIQUE, "
  			+ "name 			VARCHAR(255) NOT NULL, "
  			+ "url 				VARCHAR(255) NOT NULL, "
  			+ "description 		TEXT NULL, "
  			+ "email 			VARCHAR(255) NULL, "
  			+ "imageId 			INT NULL REFERENCES `images`(`id`) " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `webhooks` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "url VARCHAR(255) NOT NULL, "
  			+ "secret VARCHAR(255) NOT NULL, "
  			+ "systemId INT NOT NULL REFERENCES `systems`(`id`), "
  			+ "UNIQUE KEY `url_and_system` (`url`, `systemId`) " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `issuers` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "slug 			VARCHAR(255) NOT NULL, "
  			+ "name 			VARCHAR(255) NOT NULL, "
  			+ "url 				VARCHAR(255) NOT NULL, "
  			+ "description 		TEXT NULL, "
  			+ "email 			VARCHAR(255) NULL, "
  			+ "imageId 			INT NULL REFERENCES `images`(`id`), "
  			+ "systemId 		INT NULL REFERENCES `systems`(`id`) " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `programs` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug VARCHAR(255) NOT NULL, "
  			+ "name VARCHAR(255) NOT NULL, "
  			+ "url VARCHAR(255) NOT NULL, "
  			+ "description TEXT NULL, "
  			+ "email VARCHAR(255) NULL, "
  			+ "imageId INT NULL REFERENCES `images`(`id`), "
  			+ "issuerId INT NULL REFERENCES `issuers`(`id`), "
  			+ "UNIQUE KEY `slug_and_issuer` (`slug`, `issuerId`) " 
            + ") ENGINE=InnoDB;", callback);

	db.runSql("CREATE TABLE IF NOT EXISTS `badges` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "name             VARCHAR(128) NOT NULL," 
            + "slug 			VARCHAR(255) NOT NULL, "
            + "name 			VARCHAR(255) NOT NULL, "
  			+ "strapline 		VARCHAR(140) NULL, "
  			+ "earnerDescription TEXT NOT NULL, "
  			+ "consumerDescription TEXT NOT NULL, "
  			+ "issuerUrl 		VARCHAR(255), "
  			+ "rubricUrl 		VARCHAR(255), "
  			+ "criteriaUrl 		VARCHAR(255) NOT NULL, "
  			+ "timeValue 		INT, "
  			+ "timeUnits 		ENUM('minutes', 'hours', 'days', 'weeks'), "
  			+ "limit 			INT, "
  			+ "unique 			BOOLEAN NOT NULL DEFAULT FALSE, "
  			+ "archived 		BOOLEAN NOT NULL DEFAULT FALSE, "
  			+ "created 			TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "
  			+ "imageId 			INT NOT NULL REFERENCES `images`(`id`), "
  			+ "programId 		INT NULL REFERENCES `programs`(`id`), "
  			+ "issuerId 		INT NULL REFERENCES `issuers`(`id`), "
  			+ "systemId 		INT NULL REFERENCES `systems`(`id`), "
  			+ "type 			VARCHAR(255) NOT NULL " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `categories` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "badgeId 			INT NOT NULL REFERENCES `badges`(`id`), "
  			+ "value 			VARCHAR(255) NOT NULL " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `claimCodes` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "code 			VARCHAR(255) NOT NULL, "
  			+ "claimed 			BOOLEAN NOT NULL DEFAULT FALSE, "
  			+ "email 			VARCHAR(255) NULL, "
  			+ "multiuse 		BOOLEAN NOT NULL DEFAULT FALSE, "
  			+ "badgeId 			INT NOT NULL REFERENCES `badges`(`id`), "
  			+ "UNIQUE KEY 		`code_and_badge` (`code`, `badgeId`) " 
            + ") ENGINE=InnoDB;", callback);


  db.runSql("CREATE TABLE IF NOT EXISTS `badgeInstances` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "slug 			VARCHAR(255) NOT NULL UNIQUE, "
  			+ "email 			VARCHAR(255) NOT NULL, "
  			+ "issuedOn 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "
  			+ "expires 			TIMESTAMP NULL, "
  			+ "claimCode 		VARCHAR(255) NULL, "
  			+ "badgeId` 		INT NOT NULL REFERENCES `badges`(`id`), "
  			+ "UNIQUE KEY 		`email_and_badge` (`email`, `badgeId`) " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `images` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "slug 			VARCHAR(255) NOT NULL UNIQUE, "
  			+ "url 				VARCHAR(255), "
  			+ "mimetype 		VARCHAR(255), "
  			+ "data 			LONGBLOB " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `criteria` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "badgeId 			INT NOT NULL REFERENCES `badges`(`id`), "
  			+ "description 		TEXT NOT NULL, "
  			+ "note 			TEXT NOT NULL, "
  			+ "required 		BOOL NOT NULL DEFAULT FALSE " 
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `tags` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "badgeId 			INT NOT NULL, "
  			+ "value 			VARCHAR(255) NOT NULL " 
            + ") ENGINE=InnoDB;", callback);


  db.runSql("CREATE TABLE IF NOT EXISTS `applications` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "slug VARCHAR(255) NOT NULL, "
  			+ "badgeId INT NOT NULL REFERENCES `badges`(`id`), "
  			+ "learner VARCHAR(255) NOT NULL, "
  			+ "created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "
  			+ "assignedTo VARCHAR(255) NULL, "
  			+ "assignedExpiration TIMESTAMP NULL, "
  			+ "processed TIMESTAMP NULL, "
  			+ "programId INT NULL REFERENCES `programs`(`id`), "
  			+ "issuerId INT NULL REFERENCES `issuers`(`id`), "
  			+ "systemId INT NULL REFERENCES `systems`(`id`) "
            + ") ENGINE=InnoDB;", callback); 

  db.runSql("CREATE TABLE IF NOT EXISTS `evidence` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "applicationId 	INT NOT NULL REFERENCES `applications`(`id`), "
  			+ "url 				VARCHAR(255) NULL, "
  			+ "mediaType 		ENUM('image', 'link') NULL, "
  			+ "reflection 		TEXT NULL "
            + ") ENGINE=InnoDB;", callback);
	
  db.runSql("CREATE TABLE IF NOT EXISTS `reviews` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"  
            + "slug 			VARCHAR(255) NOT NULL, "
  			+ "applicationId 	INT NOT NULL REFERENCES applications(id), "
  			+ "author 			VARCHAR(255) NOT NULL, "
  			+ "comment 			TEXT NULL "
            + ") ENGINE=InnoDB;", callback); 

  db.runSql("CREATE TABLE IF NOT EXISTS `milestones` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "systemId 		INT NOT NULL, "
  			+ "primaryBadgeId 	INT NOT NULL, "
  			+ "numberRequired 	INT NOT NULL, "
  			+ "action 			ENUM('issue', 'queue-application') DEFAULT 'issue', "
  			+ "PRIMARY KEY (`id`), "
  			+ "FOREIGN KEY (`systemId`) "
    		+ "  REFERENCES `systems`(`id`) "
    		+ "  ON DELETE CASCADE "
    		+ "  ON UPDATE CASCADE, "
  			+ "FOREIGN KEY (`primaryBadgeId`) "
    		+ "  REFERENCES `badges`(`id`) "
    		+ "  ON DELETE CASCADE "
    		+ "  ON UPDATE CASCADE "
            + ") ENGINE=InnoDB;", callback);
 
  db.runSql("CREATE TABLE IF NOT EXISTS `reviewItems` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "reviewId 		INT NOT NULL REFERENCES `reviews`(`id`), "
  			+ "criterionId 		INT NOT NULL REFERENCES `criteria`(`id`), "
  			+ "satisfied 		BOOLEAN NOT NULL DEFAULT FALSE, "
  			+ "comment 			TEXT NULL "
            + ") ENGINE=InnoDB;", callback);

  db.runSql("CREATE TABLE IF NOT EXISTS `milestoneBadges` ("
            + "id               BIGINT AUTO_INCREMENT PRIMARY KEY," 
            + "milestoneId INT NOT NULL, "
  			+ "badgeId INT NOT NULL, "
  			+ "PRIMARY KEY (`id`), "
  			+ "UNIQUE KEY `milestone_and_badge` (`milestoneId`, `badgeId`), "
  			+ "FOREIGN KEY (`milestoneId`) "
    		+ "REFERENCES `milestones`(`id`) "
    		+ "  ON DELETE CASCADE "
    		+ "  ON UPDATE CASCADE, "
  			+ "FOREIGN KEY (`badgeId`) "
    		+ "  REFERENCES `badges`(`id`) "
    		+ "  ON DELETE CASCADE "
    		+ "  ON UPDATE CASCADE "
            + ") ENGINE=InnoDB;", callback);
};
 
exports.down = function(db, callback) {
  db.runSql("DROP TABLE IF EXISTS `systems`;", callback);
  db.runSql("DROP TABLE IF EXISTS `webhooks`;", callback);
  db.runSql("DROP TABLE IF EXISTS `issuers`;", callback);
  db.runSql("DROP TABLE IF EXISTS `programs`;", callback);
  db.runSql("DROP TABLE IF EXISTS `badges`;", callback);
  db.runSql("DROP TABLE IF EXISTS `categories`;", callback);
  db.runSql("DROP TABLE IF EXISTS `claimCodes`;", callback);
  db.runSql("DROP TABLE IF EXISTS `badgeInstances`;", callback);
  db.runSql("DROP TABLE IF EXISTS `images`;", callback);
  db.runSql("DROP TABLE IF EXISTS `criteria`;", callback);
  db.runSql("DROP TABLE IF EXISTS `tags`;", callback);
  db.runSql("DROP TABLE IF EXISTS `applications`;", callback);
  db.runSql("DROP TABLE IF EXISTS `evidence`;", callback);
  db.runSql("DROP TABLE IF EXISTS `reviews`;", callback);
  db.runSql("DROP TABLE IF EXISTS `reviewItems`;", callback);
  db.runSql("DROP TABLE IF EXISTS `milestones`;", callback);
  db.runSql("DROP TABLE IF EXISTS `milestoneBadges`;", callback);
};

