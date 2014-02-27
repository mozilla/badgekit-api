DROP TABLE IF EXISTS `consumers`;
CREATE TABLE `consumers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `apiKey` VARCHAR(255) NOT NULL UNIQUE,
  `apiSecret` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `systemId` INT NOT NULL REFERENCES `systems`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `systems`;
CREATE TABLE `systems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `webhooks`;
CREATE TABLE `webhooks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) NOT NULL,
  `secret` VARCHAR(255) NOT NULL,
  `systemId` INT NOT NULL REFERENCES `systems`(`id`),
  UNIQUE KEY `url_and_system` (`url`, `systemId`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `issuers`;
CREATE TABLE `issuers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  `systemId` INT NULL REFERENCES `systems`(`id`),
  UNIQUE KEY `slug_and_system` (`slug`, `systemId`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  `issuerId` INT NULL REFERENCES `issuers`(`id`),
  UNIQUE KEY `slug_and_issuer` (`slug`, `issuerId`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `badges`;
CREATE TABLE `badges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `strapline` VARCHAR(140) NULL,
  `earnerDescription` TEXT NOT NULL,
  `consumerDescription` TEXT NOT NULL,
  `issuerUrl` VARCHAR(255),
  `rubricUrl` VARCHAR(255),
  `criteriaUrl` VARCHAR(255) NOT NULL,
  `timeValue` INT,
  `timeUnits` ENUM('minutes', 'hours', 'days', 'weeks'),
  `limit` INT,
  `unique` BOOLEAN NOT NULL DEFAULT FALSE,
  `archived` BOOLEAN NOT NULL DEFAULT FALSE,
  `imageId` INT NOT NULL REFERENCES `images`(`id`),
  `programId` INT NULL REFERENCES `programs`(`id`),
  `issuerId` INT NULL REFERENCES `issuers`(`id`),
  `systemId` INT NULL REFERENCES `systems`(`id`),
  UNIQUE KEY `slug_and_system` (`slug`, `systemId`),
  UNIQUE KEY `slug_and_issuer` (`slug`, `issuerId`),
  UNIQUE KEY `slug_and_program` (`slug`, `programId`),
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `badgeInstances`;
CREATE TABLE `badgeInstances` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `issuedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires` TIMESTAMP NULL,
  `badgeId` INT NOT NULL REFERENCES `badges`(`id`),
  UNIQUE KEY `email_and_badge` (`email`, `badgeId`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  -- require either URL or mimetype & data
  `url` VARCHAR(255),
  `mimetype` VARCHAR(255),
  `data` LONGBLOB,
  PRIMARY KEY (`id`)
) CHARACTER SET binary
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `criteria`;
CREATE TABLE `criteria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `badgeId` INT NOT NULL REFERENCES `badges`(`id`),
  `description` TEXT NOT NULL,
  `note` TEXT NOT NULL,
  `required` BOOL NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`)
) CHARACTER SET binary
  ENGINE=InnoDB;

