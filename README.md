# badgekit-api

## Environment Configuration

* `NODE_ENV`: set to `production` for production environments. If you want to run the test suite, set this to `test`. **DO NOT SET THIS TO `test` ON PRODUCTION MACHINES, BAD THINGS WILL HAPPEN**, mainly authentication will be inactive and you run the risk of accidentally dropping your database.
* `DB_HOST`: defaults to `localhost`
* `DB_NAME`: name of the database to store badgekit data.
* `DB_USER`: user who has full access to the `DB_NAME` table
* `DB_PASSWORD`: password for the `DB_USER`.
* `MASTER_SECRET`: the master secret used to sign global-access JWT tokens. This should not be shared widely – probably only with one frontend, e.g. `badgekit`.