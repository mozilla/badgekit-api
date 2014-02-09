DROP TABLE IF EXISTS `systems`;
CREATE TABLE `systems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `issuers`;
CREATE TABLE `issuers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  `systemId` INT NULL REFERENCES `systems`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  `issuerId` INT NULL REFERENCES `issuers`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;


DROP TABLE IF EXISTS `badges`;
CREATE TABLE `badges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `strapline` VARCHAR(50) NULL,
  `description` TEXT NOT NULL,
  `archived` BOOLEAN NOT NULL DEFAULT FALSE,
  `imageId` INT NOT NULL REFERENCES `images`(`id`),
  `programId` INT NULL REFERENCES `programs`(`id`),
  `issuerId` INT NULL REFERENCES `issuers`(`id`),
  `systemId` INT NULL REFERENCES `systems`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  -- require either URL or mimetype & data
  `url` VARCHAR(255),
  `mimetype` VARCHAR(255),
  `data` LONGBLOB,
  PRIMARY KEY (`id`)
) CHARACTER SET binary
  ENGINE=InnoDB;
