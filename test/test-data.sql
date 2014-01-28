INSERT INTO `issuers` SET
  `slug` = 'chicago',
  `name` = 'Chicago',
  `url` = 'http://cityofchicago.org',
  `description` = 'The City of Chicago',
  `email` = 'mayor-emanuel@cityofchicago.org';

INSERT INTO `issuers` SET
  `slug` = 'pittsburgh',
  `name` = 'Pittsburgh',
  `url` = 'http://pittsburghpa.gov',
  `description` = 'The City of Pittsburgh',
  `email` = 'mayor-ravenstahl@pittsburghpa.gov';

INSERT INTO `badges` SET
  `slug` = 'chicago-badge',
  `name` = 'Chicago Badge',
  `strapline` = 'A badge for Chicago';

INSERT INTO `badges` SET
  `slug` = 'pittsburgh-badge',
  `name` = 'Pittsburgh Badge',
  `strapline` = 'A badge for Pittsburgh';

INSERT INTO `badges` SET
  `slug` = 'archived-badge',
  `name` = 'Archived Badge',
  `strapline` = 'An archived badge',
  `archived` = 1;

INSERT INTO `programs` SET
  `slug` = 'mit-scratch',
  `name` = 'MIT Scratch',
  `url` = 'http://scratch.mit.edu/',
  `description` = 'Create stories, games, and animations. Share with others around the world',
  `email` = 'admin@scratch.mit.edu';

INSERT INTO `programs` SET
  `slug` = 'khan-academy',
  `name` = 'Khan Academy',
  `url` = 'https://www.khanacademy.org/',
  `description` = 'Start learning now',
  `email` = 'admin@khanacademy.org';
