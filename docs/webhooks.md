# System Callbacks (Webhooks)

The system level object includes the configuration of a single webhook URL which will receive notifications when events occur in that system. To configure a webhook in your BadgeKit API database, add a record to the `webhooks` table, indicating the URL to send the webhook notifications to plus a secret you can use to authenticate the data received. For a more detailed overview of configuring your webhook, see [Application Review Webhooks - Configuring a Webhook](https://github.com/mozilla/badgekit-api/wiki/Application-Review-Webhooks#configuring-a-webhook).

If you're reading this documentation and need to configure a webhook on [BadgeKit.org](http://badgekit.org) please contact your BadgeKit support person.

BadgeKit will send data to your webhook URL when these events occur:

* [An application review is submitted](#new-application-review-submitted)
* [A badge is awarded/issued (a badge instance is created)](#new-badge-instance-created)

## Authentication

Each call to the webhook will be signed with the key you set in your webhooks database table record. The signature works exactly like calls to the BadgeKit API. For more information, see [authorization](authorization.md).

## New Application Review Submitted

Called when a review is submitted for a badge application. The API sends the webhook the action (which will be `review`), the application data, the review data and approved status. Issuers can then process the application, responding by communicating with the earner and/or issuing the badge.

Note that when a review is submitted that approves the application, the badge is NOT automatically awarded. The receiver of this webhook will have to call back to BadgeKit API to award the badge if that is the desired behavior - see [Issuing - Create a Badge Instance](issuing.md#create-a-badge-instance). _For example, you may wish to communicate with the earner for confirmation that they wish to be awarded the badge._ Similarly, the badge application will remain active and reviewable until a call is made to BadgeKit API that sets a `processed` timestamp on the application - see [Assessment - Update an Application](assessment.md#update-an-application).

### Example Message

```json
{
    "action": "review",
    "application": 
    {
        "id": 123,
        "slug": "abcdefg1234567",
        "learner": "earner@adomain.com",
        "created": "2014-05-12T15:13:07.000Z",
        "assignedTo": null,
        "assignedExpiration": null,
        "badge": 
        {
            "id": 61,
            "slug": "badge-slug",
            ...
        },

        "processed": null,
        "evidence": [ ]
    },

    "review": 
    {
        "id": 456,
        "slug": "1234567abcdefg",
        "author": "reviewer@adomain.com",
        "comment": "Comment from reviewer to earner.",
        "reviewItems": 
        [
            {
                "criterionId": 221,
                "satisfied": 1,
                "comment": "Exactly right."
            },
            ...
        ]
    },

    "approved": true
}
```

#### Message structure

* action
* [application](assessment.md#applications)
 * [badge](badges.md)
* [review](assessment.md#reviews)
* approved

## New Badge Instance Created

In BadgeKit, issuing a badge to an earner means creating a [badge instance](issuing.md#create-a-badge-instance). When a badge instance is created, the API sends a message to the webhook including the details of the badge instance and assertion. The message includes the action (which will be `award`), the UID, the badge awarded, the earner email, the assertion URL, the date issued and an optional comment.

### Example Message

```json
{
    "action": "award",
    "uid": "abcdefghijkl123456789098",
    "badge": 
    {
        "id": 11,
        "slug": "badge-slug",
        ...
    },

    "email": "anearner@adomain.com",
    "assertionUrl": "http://issuersite.com/public/assertions/abcdefghijkl123456789098",
    "issuedOn": 1400094712,
    "comment": null
}
```

#### Message structure

* action
* uid
* [badge](badges.md)
* email
* assertionUrl
* issuedOn
* comment

## Guides

For more on handling the webhook data, see the following pages in the BadgeKit API wiki:

* [Application Review Webhooks](https://github.com/mozilla/badgekit-api/wiki/Application-Review-Webhooks) 
* [Badge Issued Webhooks](https://github.com/mozilla/badgekit-api/wiki/Badge-Issued-Webhooks).
