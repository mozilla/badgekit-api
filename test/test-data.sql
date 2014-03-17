INSERT INTO `images` SET
  `id` = 1,
  `slug` = 'some-image',
  `url` = 'http://example.org/test.png';

INSERT INTO `systems` SET
  `id` = 1,
  `imageId` = 1,
  `slug` = 'chicago',
  `name` = 'Chicago',
  `url` = 'http://cityofchicago.org',
  `description` = 'The City of Chicago',
  `email` = 'mayor-emanuel@cityofchicago.org';

INSERT INTO `systems` SET
  `id` = 2,
  `imageId` = 1,
  `slug` = 'pittsburgh',
  `name` = 'Pittsburgh',
  `url` = 'http://pittsburghpa.gov',
  `description` = 'The City of Pittsburgh',
  `email` = 'mayor-ravenstahl@pittsburghpa.gov';

INSERT INTO `consumers` SET
  `id` = 1,
  `apiKey` = 'radical',
  `apiSecret` = 'At9p1PVNW5jQAV8LnvfGdpbnuAcxq765pBNNhV9Kjnvgyn4S7YEs7KgVla1OGyny',
  `systemId` = 1;

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
  `imageId` = 1,
  `slug` = 'mit-scratch',
  `name` = 'MIT Scratch',
  `url` = 'http://scratch.mit.edu/',
  `description` = 'Create stories, games, and animations. Share with others around the world',
  `email` = 'admin@scratch.mit.edu';

INSERT INTO `programs` SET
  `id` = 2,
  `imageId` = 1,
  `slug` = 'khan-academy',
  `name` = 'Khan Academy',
  `url` = 'https://www.khanacademy.org/',
  `description` = 'Start learning now',
  `email` = 'admin@khanacademy.org';

INSERT INTO `badges` SET
  `id` = 1,
  `systemId` = 1,
  `slug` = 'chicago-badge',
  `name` = 'Chicago Badge',
  `earnerDescription` = 'An earner description of the Chicago Badge',
  `consumerDescription` = 'A consumer description of the Chicago Badge',
  `rubricUrl` = 'http://example.org/chicagoRubric',
  `criteriaUrl` = 'http://example.org/chicagoCriteria',
  `issuerUrl` = 'http://example.org/chicagoIssuer',
  `timeValue` = 10,
  `timeUnits` = 'minutes',
  `limit` = 5,
  `unique` = 1,
  `strapline` = 'A badge for Chicago',
  `imageId` = 1;

INSERT INTO `badges` SET
  `id` = 2,
  `systemId` = 2,
  `slug` = 'pittsburgh-badge',
  `name` = 'Pittsburgh Badge',
  `earnerDescription` = 'An earner description of the Pittsburgh Badge',
  `consumerDescription` = 'A consumer description of the Pittsburgh Badge',
  `rubricUrl` = 'http://example.org/pittsburghRubric',
  `criteriaUrl` = 'http://example.org/pittsburghCriteria',
  `issuerUrl` = 'http://example.org/pittsburghIssuer',
  `timeValue` = 9,
  `timeUnits` = 'hours',
  `limit` = null,
  `unique` = 0,
  `strapline` = 'A badge for Pittsburgh',
  `imageId` = 1;

INSERT INTO `badges` SET
  `id` = 3,
  `systemId` = 1,
  `slug` = 'archived-badge',
  `name` = 'Archived Badge',
  `earnerDescription` = 'An earner description of the Archived Badge',
  `consumerDescription` = 'A consumer description of the Archived Badge',
  `rubricUrl` = 'http://example.org/archivedRubric',
  `criteriaUrl` = 'http://example.org/archivedCriteria',
  `issuerUrl` = 'http://example.org/archivedIssuer',
  `timeValue` = 5,
  `timeUnits` = 'hours',
  `limit` = 2,
  `unique` = 1,
  `strapline` = 'An archived badge',
  `archived` = 1,
  `imageId` = 1;

INSERT INTO `badges` SET
  `id` = 4,
  `systemId` = 1,
  `issuerId` = 1,
  `programId` = 1,
  `slug` = 'chicago-scratch-badge',
  `name` = 'Chicago Scratch Badge',
  `earnerDescription` = 'An earner description of the Chicago Scratch Badge',
  `consumerDescription` = 'A consumer description of the Chicago Scratch Badge',
  `rubricUrl` = 'http://example.org/chicaogScratchRubric',
  `criteriaUrl` = 'http://example.org/chicagoScratchCriteria',
  `issuerUrl` = 'http://example.org/chicagoIssuerUrl',
  `timeValue` = 5,
  `timeUnits` = 'hours',
  `limit` = 2,
  `unique` = 1,
  `strapline` = 'A badge for doing Scratch in Chicago',
  `imageId` = 1;

INSERT INTO `badges` SET
  `id` = 5,
  `systemId` = 1,
  `issuerId` = 1,
  `slug` = 'chicago-library-badge',
  `name` = 'Chicago Library Badge',
  `earnerDescription` = 'An earner description of the Chicago Library Badge',
  `consumerDescription` = 'A consumer description of the Chicago Library Badge',
  `rubricUrl` = 'http://example.org/chicaogLibraryRubric',
  `criteriaUrl` = 'http://example.org/chicagoLibraryCriteria',
  `issuerUrl` = 'http://example.org/chicagoIssuerUrl',
  `timeValue` = 5,
  `timeUnits` = 'hours',
  `limit` = 2,
  `unique` = 1,
  `strapline` = 'A badge for doing Library in Chicago',
  `imageId` = 1;

INSERT INTO `claimCodes` SET
  `code` = 'multiple-use',
  `multiuse` = true,
  `badgeId` = 1;

INSERT INTO `claimCodes` SET
  `code` = 'single-use',
  `multiuse` = false,
  `badgeId` = 1;

INSERT INTO `claimCodes` SET
  `code` = 'for-pittsburgh',
  `multiuse` = false,
  `badgeId` = 2;

INSERT INTO `claimCodes` SET
  `code` = 'delete-me',
  `multiuse` = true,
  `badgeId` = 1;

INSERT INTO `criteria` SET
  `id` = 1,
  `badgeId` = 1,
  `description` = 'Just your basic criterion.',
  `note` = 'Some sort of note',
  `required` = TRUE;

INSERT INTO `applications` SET
  `id` = 1,
  `slug` = 'app-scratch',
  `systemId` = 1,
  `issuerId` = 1,
  `programId` = 1,
  `badgeId` = 4,
  `learner` = 'edogg@dujg.com',
  `webhook` = 'http://example.org/webhook1';

INSERT INTO `applications` SET
  `id` = 2,
  `slug` = 'app-archived',
  `badgeId` = 3,
  `systemId` = 1,
  `learner` = 'totebag@dujg.com',
  `webhook` = 'http://example.org/webhook2';

INSERT INTO `applications` SET
  `id` = 3,
  `slug` = 'app-pittsburgh',
  `badgeId` = 2,
  `systemId` = 2,
  `learner` = 'totebag@dujg.com',
  `webhook` = 'http://example.org/webhook3';

INSERT INTO `evidence` SET
  `id` = 1,
  `applicationId` = 1,
  `url` = 'http://example.org/evidence1.png',
  `mediaType` = 'image',
  `reflection` = 'Check out this awesome evidence for Chicago Scratch';

INSERT INTO `evidence` SET
  `id` = 2,
  `applicationId` = 1,
  `url` = 'http://example.org/evidence2',
  `mediaType` = 'link';

INSERT INTO `evidence` SET
  `id` = 3,
  `applicationId` = 2,
  `url` = 'http://example.org/evidence3.png',
  `mediaType` = 'image',
  `reflection` = 'Evidence for Archived';

INSERT INTO `reviews` SET
  `id` = 1,
  `slug` = 'review-scratch',
  `applicationId` = 1,
  `author` = 'erik@example.org',
  `comment` = 'My scratch comment.';

INSERT INTO `reviews` SET
  `id` = 2,
  `slug` = 'review-archived',
  `applicationId` = 2,
  `author` = 'erik@example.org',
  `comment` = 'My archived comment.';

INSERT INTO `reviewItems` SET
  `id` = 1,
  `reviewId` = 1,
  `criterionId` = 1,
  `satisfied` = TRUE,
  `comment` = 'Nice work, yo.';
