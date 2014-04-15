# BadgeKit API

The BadgeKit API provides back-end processing and data storage for issuing Open Badges. You can use the API in conjunction with the [BadgeKit app](https://github.com/mozilla/openbadges-badgekit) or can use the API itself, with your own front-ends for badge admin and for earners. With BadgeKit handling the data for badges and earner applications, you can deliver interaction with your community of badge earners, plugging into the API for data and to respond to badge issuing events.

__Note that BadgeKit is not intended to handle earner data - the tools are designed to deliver admin functions for issuing Open Badges, while you provide earner interaction within your own site. This allows organizations to own and control the data for their own communities.__

__The BadgeKit Web app links to the API to create an admin user interface for creating badges and managing applications for them - if you don't use the app, you can use the API in conjunction with your own system for creating badges and managing earner applications. Either way, you deliver the earner interaction to suit your community.__

## Using the API

The BadgeKit API provides a series of endpoints through which your sites can interact with badge data. Examples would be retrieving a list of currently published badges, creating a new badge or updating the data for an existing badge. When you make a request, the API will return JSON data. You can then present the returned data within your own site interface.

In addition to the series of calls you can make to interact with data, the API also provides webhooks for badging events such as a badge being issued or an earner application being reviewed. By configuring a URL to receive notification of these events, you can build your own custom responses, for example informing an earner that their badge application was successful.

### Authorization

API calls should be signed with a JWT token generated using the secret for your BadgeKit API instance. See the [Authorization Document](https://github.com/mozilla/badgekit-api/blob/master/docs/authorization.md) for details.

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
