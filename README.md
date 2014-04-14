# BadgeKit API

The BadgeKit API provides back-end processing and data storage for issuing Open Badges. You can use the API in conjunction with the [BadgeKit app](https://github.com/mozilla/openbadges-badgekit) or can use the API itself, with your own front-ends for badge admin and for earners. With BadgeKit handling the data for active badges and earner applications, you can deliver interaction with your community of badge earners, plugging into the API for data and to respond to events such as badges being issued.

__Note that BadgeKit is not intended to handle earner data - the tools are designed to deliver admin functions for issuing Open Badges, while you provide earner interaction within your own site. The BadgeKit Web app links to the API to create an admin user interface for creating badges and managing applications for them - if you don't use the app, you can use the API in conjunction with your own system for creating badges and managing earner applications.__

## Installation

To install the BadgeKit API: 
* clone the repo
* set up a database
* set your environment configs.

You can use the `schema.sql` file in the root directory to create your database. You also need to add an entry in the `system` table, providing an initial slug and system name for a badge issuing system. See the [wiki](https://github.com/mozilla/badgekit-api/wiki) for more details and the [Self-Hosting guide](https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-Self-Hosting-Guide) if you plan on building your own instance of the BadgeKit Web app as well as the API.

## Environment Configuration

The BadgeKit API currently uses the following configuration details:

* `NODE_ENV`: Set to `production` for production environments. If you want to run the test suite, set this to `test`. **DO NOT SET THIS TO `test` ON PRODUCTION MACHINES, BAD THINGS WILL HAPPEN** - mainly authentication will be inactive and you run the risk of accidentally dropping your database.
* `DB_HOST`: Defaults to `localhost`.
* `DB_NAME`: Name of the database to store BadgeKit data.
* `DB_USER`: User who has full access to the `DB_NAME` table.
* `DB_PASSWORD`: Password for the `DB_USER`.
* `MASTER_SECRET`: The master secret used to sign global-access JWT tokens. This should not be shared widely – probably only with one frontend, e.g. `badgekit`.
