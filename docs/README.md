# BadgeKit API Documentation

The BadgeKit API docs include the information you need to get started using the endpoints and webhooks. The docs are structured as follows:

* [API Endpoints](api-endpoints.md)
 * Containers:
    * [Systems](systems.md)
    * [Issuers](issuers.md)
    * [Programs](programs.md)
 * Badge Management:
    * [Badges](badges.md)
      * [Milestones](milestones.md)
    * [Claim Codes](claim-codes.md)
    * [Issuing](issuing.md)
    * [Assessment](assessment.md)
* [Webhooks](webhooks.md)
* [Authorization](authorization.md)

You can interact with badge and application data managed by the API using the endpoints. The data you send to the API endpoints needs to be signed for authentication, and the data you receive from the API (in responses and webhook messages) is signed before it is sent. To detect badging events carried out through the API, such as badges being issued and badge applications being reviewed, you can configure a webhook URL to which BadgeKit API will send data.

The API docs provide a reference for the endpoints and webhooks. You will also find detailed guides to carrying out common processes, including the assessment flow, together with sample code excerpts, in the [BadgeKit API wiki](https://github.com/mozilla/badgekit-api/wiki):

* [Using BadgeKit API](https://github.com/mozilla/badgekit-api/wiki/Using-BadgeKit-API)
* [Retrieving Badges](https://github.com/mozilla/badgekit-api/wiki/Retrieving-Badges)
* [Submitting Applications](https://github.com/mozilla/badgekit-api/wiki/Submitting-Applications)
* [Application Review Webhooks](https://github.com/mozilla/badgekit-api/wiki/Application-Review-Webhooks)
* [Awarding Badges](https://github.com/mozilla/badgekit-api/wiki/Awarding-Badges)
* [Badge Issued Webhooks](https://github.com/mozilla/badgekit-api/wiki/Badge-Issued-Webhooks)

For additional support using BadgeKit or the API, feel free to get in touch using one of the following methods:

* Post general questions in our [Community Google Groups](http://bit.ly/OBIGeneral) and post technical questions in our [Dev Google Group](http://bit.ly/OBIDev).
* Reach members of the Open Badges team directly on IRC (irc.mozilla.org) on the #badges channel.
* Email questions directly to [badges@mozillafoundation.org](mailto:badges@mozillafoundation.org) and a member of the team will follow-up.
* Follow or tweet the Open Badges team [@OpenBadges](https://twitter.com/OpenBadges).
* Get involved or submit issues via the GitHub repos - feedback is always appreciated!
