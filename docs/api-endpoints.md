# API Endpoints

See the following overview of the available BadgeKit API endpoints - browse to the linked docs in each section for more detailed information.

* Containers
  * [Systems](systems.md)
    * **GET** /systems
    * **POST** /systems
    * **GET** /systems/:slug
    * **PUT** /systems/:slug
    * **DELETE** /systems/:slug
  * [Issuers](issuers.md)
    * **GET** /systems/:slug/issuers
    * **POST** /systems/:slug/issuers
    * **GET** /systems/:slug/issuers/:slug
    * **PUT** /systems/:slug/issuers/:slug
    * **DELETE** /systems/:slug/issuers/:slug
  * [Programs](programs.md)
    * **GET** /systems/:slug/issuers/:slug/programs
    * **POST** /systems/:slug/issuers/:slug/programs
    * **GET** /systems/:slug/issuers/:slug/programs/:slug
    * **PUT** /systems/:slug/issuers/:slug/programs/:slug
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug
* Badge Management
  * [Badges](badges.md) (can belong directly to a system, issuer or program)
    * **GET** /systems/:slug/badges
    * **GET** /systems/:slug/issuers/:slug/badges
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges
    * **POST** /systems/:slug/badges
    * **POST** /systems/:slug/issuers/:slug/badges
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges
    * **GET** /systems/:slug/badges/:slug
    * **GET** /systems/:slug/issuers/:slug/badges/:slug
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug
    * **PUT** /systems/:slug/badges/:slug
    * **PUT** /systems/:slug/issuers/:slug/badges/:slug
    * **PUT** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug
    * **DELETE** /systems/:slug/badges/:slug
    * **DELETE** /systems/:slug/issuers/:slug/badges/:slug
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug
    * **GET** /public/badges
  * [Claim Codes](claim-codes.md)
    * **GET** /systems/:slug/codes/:code
    * **GET** /systems/:slug/issuers/:slug/codes/:code
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/codes/:code
    * **GET** /systems/:slug/badges/:slug/codes
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/codes
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes
    * **POST** /systems/:slug/badges/:slug/codes
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/codes
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes
    * **POST** /systems/:slug/badges/:slug/codes/random
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/codes/random
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/random
    * **GET** /systems/:slug/badges/:slug/codes/:code
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/codes/:code
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code
    * **DELETE** /systems/:slug/badges/:slug/codes/:code
    * **DELETE** /systems/:slug/issuers/:slug/badges/:slug/codes/:code
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code
    * **POST** /systems/:slug/badges/:slug/codes/:code/claim
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/codes/:code/claim
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code/claim
  * [Issuing](issuing.md) (badge instances)
    * **GET** /systems/:slug/instances/:email
    * **GET** /systems/:slug/issuers/:slug/instances/:email
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/instances/:email
    * **GET** /systems/:slug/badges/:slug/instances
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/instances
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances
    * **GET** /systems/:slug/badges/:slug/instances/:email
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/instances/:email
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances/:email
    * **POST** /systems/:slug/badges/:slug/instances
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/instances
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances
    * **DELETE** /systems/:slug/badges/:slug/instances/:email
    * **DELETE** /systems/:slug/issuers/:slug/badges/:slug/instances/:email
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances/:email
  * [Assessment](assessment.md) (managing earner applications for badges)
    * **GET** /systems/:slug/applications
    * **GET** /systems/:slug/issuers/:slug/applications
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/applications
    * **GET** /systems/:slug/badges/:slug/applications
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/applications
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications
    * **POST** /systems/:slug/badges/:slug/applications
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/applications
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications
    * **PUT** /systems/:slug/badges/:slug/applications/:slug
    * **PUT** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
    * **PUT** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
    * **GET** /systems/:slug/badges/:slug/applications/:slug
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
    * **DELETE** /systems/:slug/badges/:slug/applications/:slug
    * **DELETE** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
    * **GET** /systems/:slug/badges/:slug/applications/:slug/reviews
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews
    * **GET** /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **GET** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **GET** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **POST** /systems/:slug/badges/:slug/applications/:slug/reviews
    * **POST** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews
    * **POST** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews
    * **PUT** /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **PUT** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **PUT** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **DELETE** /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **DELETE** /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
    * **DELETE** /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
  * [Milestones](milestones.md)
    * **GET** /systems/:slug/milestones
    * **POST** /systems/:slug/milestones
    * **GET** /systems/:slug/milestones/:milestoneId
    * **PUT** /systems/:slug/milestones/:milestoneId
    * **DELETE** /systems/:slug/milestones/:milestoneId

See also [authorization](authorization.md) and [webhooks](webhooks.md).
