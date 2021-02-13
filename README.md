# BadgeKit API

The BadgeKit API provides back-end processing and data storage for issuing Open Badges. You can use the API in conjunction with the [BadgeKit app](https://github.com/mozilla/openbadges-badgekit) or can use the API itself, with your own front-ends for badge admin and for earners. With BadgeKit handling the data for badges and earner applications, you can deliver interaction with your community of badge earners, plugging into the API for data and to respond to badge issuing events.

__Note that BadgeKit is not intended to handle earner data - the tools are designed to deliver admin functions for issuing Open Badges, while you provide earner interaction within your own site. This allows an organization to own and control the data for their own community of earners.__

__The BadgeKit Web app links to the API to create an admin user interface for creating badges and managing applications for them - if you don't use the app, you can use the API in conjunction with your own systems for creating badges and managing earner applications. Either way, you deliver the earner interaction to suit the needs of your community.__

## Using the API

The BadgeKit API provides a series of endpoints through which your sites can interact with data for badges, earner applications and issuer organization admin. Below are some examples of calls you can make to the API.

* Retrieve badges
* Submit earner applications for badges
* Submit application reviews
* Issue badges
* Generate claim codes for a badge
* Update badge data
* Manage badges within system, issuer and program admin levels

__Using issuer and program admin levels is entirely optional - you can simply configure BadgeKit to group all of your badge and application data within a single system.__

The repo [docs](docs) list all of the available endpoints provided by the API, together with examples of request and response data.

When you make a request, the API returns JSON data. You can then present the returned data within your own site interface.

In addition to the series of calls you can make to interact with data, the API also provides [webhooks](docs/webhooks.md) for badging events (such as a badge being issued or an earner application being reviewed). By configuring a URL to receive notification of these events, you can build your own custom responses, for example informing an earner that their badge application was successful.

To get started accessing the API in your own sites, see [Using BadgeKit API](https://github.com/mozilla/badgekit-api/wiki/Using-BadgeKit-API).

### Authorization

API calls should be signed with a JWT token generated using the secret for your BadgeKit API instance. See the [Authorization Document](https://github.com/mozilla/badgekit-api/blob/master/docs/authorization.md) for details.

## Installation

To install the BadgeKit API:
* clone the repo
* set your environment configs
* set up your database

You can use `bin/db-migrate up` from the root directory to create (or migrate) your database. You also need to add an entry in the `systems` table, providing an initial slug, system name and URL (optionally also description, email and image) for a badge issuing system. See the [wiki](https://github.com/mozilla/badgekit-api/wiki) for more details and the [Self-Hosting guide](https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-Self-Hosting-Guide), particularly if you plan on building your own instance of the BadgeKit Web app as well as the API.

## Environment Configuration

BadgeKit API currently uses the following configuration details:

* `NODE_ENV`: Set to `production` for production environments. If you want to run the test suite or to try out the API endpoints without JWT authorization, set this to `test`. **DO NOT SET THIS TO `test` ON PRODUCTION MACHINES, BAD THINGS WILL HAPPEN** - _authentication will be inactive and you run the risk of accidentally dropping your database_.
* `DB_HOST`: Defaults to `localhost`.
* `DB_NAME`: Name of the database to store BadgeKit data.
* `DB_USER`: User who has full access to the `DB_NAME` table.
* `DB_PASSWORD`: Password for the `DB_USER`.
* `MASTER_SECRET`: The master secret used to sign global-access JWT tokens. This should not be shared widely – probably only with one front-end, e.g. `badgekit`.

## Running all Badgekit apps on vagrant

Please see the README.vagrant.md file for a detailed walk through to setup a fast local dev environment using [Vagrant](http://www.vagrantup.com/)

This provides a mostly-prebuilt Ubuntu server, complete with MySQL and Node.JS at the correct versions.
