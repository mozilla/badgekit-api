# System Callbacks (Webhooks)

## Overview

The system level object includes the configuration of a single webhook url which will receive notifications when events occur in that system. Webhooks are configured in the [consumer model](https://github.com/mozilla/badgekit-api/blob/master/app/models/consumer.js). If you're reading this documentation and need to configure a webhook on [BadgeKit.org](http://badgekit.org) please contact your badgekit.org support person.

## Authentication

Each call to the webhook will be signed with the shared key assigned to a system. The signature works exactly like calls to the BadgeKit API. For more information, see [authorization](authorization.md).

## New Badge Instance Created

Called when an instance of a badge is created (when a badge is rewarded, not when a badge class is created).

### Message
```
{
  action: 'award',
  uid: {unique badge instance 'slug'},
  email: {email of the awardee},
  assertionUrl: {assertion url},
  issuedOn: {date / time of issuance},
}
```

## New Application Review Submitted

Called when a review is submitted for a badge application.  Note that when a review is submitted that approves the application, the badge is NOT automatically awarded.  The receiver of this webhook will have to immediately call back to BadgeKit API to award the badge if that is the desired behavior.  Similarly, the badge application will remain active and reviewable until a call is made to BadgeKit API that sets a 'processed' timestamp on the application.

### Message
```
{
  action: 'review',
  application: {application object}
  review: {review object}
  approved: {true/false, indicating whether the application was approved}
}
```
