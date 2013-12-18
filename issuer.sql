DROP TABLE IF EXISTS `system`;
CREATE TABLE `system` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `issuers`;
CREATE TABLE `issuers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `email` VARCHAR(255) NULL,
  `imageId` INT NULL REFERENCES `images`(`id`),
  PRIMARY KEY (`id`)
) CHARACTER SET utf8
  ENGINE=InnoDB;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  -- require either URL or mimetype & data
  `url` VARCHAR(255),
  `mimetype` VARCHAR(255),
  `data` LONGBLOB,
  PRIMARY KEY (`id`)
) CHARACTER SET binary
  ENGINE=InnoDB;
