INSERT INTO `systems` SET
  `id` = 1,
  `slug` = 'chicago',
  `name` = 'Chicago',
  `url` = 'http://cityofchicago.org',
  `description` = 'The City of Chicago',
  `email` = 'mayor-emanuel@cityofchicago.org';

INSERT INTO `systems` SET
  `id` = 2,
  `slug` = 'pittsburgh',
  `name` = 'Pittsburgh',
  `url` = 'http://pittsburghpa.gov',
  `description` = 'The City of Pittsburgh',
  `email` = 'mayor-ravenstahl@pittsburghpa.gov';

INSERT INTO `issuers` SET
  `id` = 1,
  `systemId` = 1,
  `imageId` = 1,
  `slug` = 'chicago-library',
  `name` = 'Chicago Public Library',
  `url` = 'http://www.chipublib.org/',
  `description` = 'Chicago Public Library',
  `email` = 'eratosthenes@chipublib.org';

INSERT INTO `issuers` SET
  `id` = 2,
  `systemId` = 2,
  `slug` = 'carnegie-library',
  `name` = 'Carnegie Library of Pittsburgh',
  `url` = 'http://carnegielibrary.org',
  `description` = 'Carnegie Library of Pittsburgh',
  `email` = 'jack-gilbert@carnegielibrary.org';

INSERT INTO `programs` SET
  `id` = 1,
  `issuerId` = 1,
  `slug` = 'mit-scratch',
  `name` = 'MIT Scratch',
  `url` = 'http://scratch.mit.edu/',
  `description` = 'Create stories, games, and animations. Share with others around the world',
  `email` = 'admin@scratch.mit.edu';

INSERT INTO `programs` SET
  `id` = 2,
  `slug` = 'khan-academy',
  `name` = 'Khan Academy',
  `url` = 'https://www.khanacademy.org/',
  `description` = 'Start learning now',
  `email` = 'admin@khanacademy.org';

INSERT INTO `badges` SET
  `id` = 1,
  `issuerId` = 1,
  `slug` = 'chicago-badge',
  `name` = 'Chicago Badge',
  `description` = 'A longer description of the badge',
  `strapline` = 'A badge for Chicago';

INSERT INTO `badges` SET
  `id` = 2,
  `systemId` = 2,
  `slug` = 'pittsburgh-badge',
  `name` = 'Pittsburgh Badge',
  `strapline` = 'A badge for Pittsburgh';

INSERT INTO `badges` SET
  `id` = 3,
  `slug` = 'archived-badge',
  `name` = 'Archived Badge',
  `strapline` = 'An archived badge',
  `archived` = 1;

INSERT INTO `badges` SET
  `id` = 4,
  `programId` = 1,
  `slug` = 'chicago-scratch-badge',
  `name` = 'Chicago Scratch Badge',
  `description` = 'A longer description of the badge',
  `strapline` = 'A badge for doing Scratch in Chicago';


INSERT INTO `images` SET
  `id` = 1,
  `slug` = 'some-image',
  `url` = 'http://example.org/test.png';
