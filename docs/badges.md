# Badges

A badge represents the generic data for an earnable badge (not an awarded badge, which is a [badge instance](issuing.md)). Badges can be published or archived. Each badge can belong to a [system](systems.md), [issuer](issuers.md) or [program](programs.md).

| NAME | VALUE |
|:---|:---|
| `id` | __integer__ - _ID from database entry_ |
| `slug` | __string__ - _Used to identify badge in API endpoints_ |
| `name` | __string__ |
| `strapline` | __string__ - _Short tagline description._ |
| `earnerDescription` | __string__ - _Description for potential earners._ |
| `consumerDescription` | __string__ - _Description for viewers of badge e.g. college admin or employer._ |
| `issuerUrl` | __string__ |
| `rubricUrl` | __string__ - _Link to supporting material._ |
| `timeValue` | __integer__ |
| `timeUnits` | __enum__ - _Can be `minutes`, `hours`, `days` or `weeks`._ |
| `limit` | __integer__ - _Optional limit for number of times badge can be earned._ |
| `unique` | __boolean__ |
| `created` | __timestamp__ |
| `imageUrl` | __string__ |
| `type` | __string__ |
| `archived` | __boolean__ |
| `system` | __integer__ - _System is represented by ID in database - system details are returned from API endpoints as nested JSON._ |
| `criteriaUrl` | __string__ |
| `criteria` | __array__ - _Includes `id`, `description`, `required` status and `note`._ |
| `categories` | __array__ - _Each category is a string._ |
| `tags` | __array__- _Each tag is a string._ |
| [`milestones`](milestones.md) | __array__ - _A milestone badge is awarded when a set of other badges are earned._ |

## Endpoints

* [Retrieve Badge List](#retrieve-badge-list)
 * `GET /systems/<slug>/badges`
 * `GET /systems/<slug>/issuers/<slug>/badges`
 * `GET /systems/<slug>/issuers/<slug>/programs/<slug>/badges`
* [Retrieve Specific Badge](#retrieve-specific-badge)
 * `GET /systems/<slug>/badges/<slug>`
 * `GET /systems/<slug>/issuers/<slug>/badges/<slug>`
 * `GET /systems/<slug>/issuers/<slug>/programs/<slug>`
* [Create New Badge](#create-new-badge)
 * `POST /systems/<slug>/badges`
 * `POST /systems/<slug>/issuers/<slug>/badges`
 * `POST / systems/<slug>/issuers/<slug>/programs/<slug>`
* [Update a Badge](#update-a-badge)
 * `PUT /systems/<slug>/badges/<slug>`
 * `PUT /systems/<slug>/issuers/<slug>/badges/<slug>`
 * `PUT /systems/<slug>/issuers/<slug>/programs/<slug>/badges/<slug>`
* [Delete a Badge](#delete-a-badge)
 * `DELETE /systems/<slug>/badges/<slug>`
 * `DELETE /systems/<slug>/issuers/<slug>/badges/<slug>`
 * `DELETE /systems/<slug>/issuers/<slug>/programs/<slug>/badges/<slug>`

## Retrieve Badge List

Retrieves all available badges, filtered by system, issuer or program.

### Expected request

```
GET /systems/:systemSlug/badges HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/badges HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges HTTP/1.1
```

#### Available request parameters

* **`archived`:** `[true|false|any]` (optional) - _Whether to include archived badges._
  * `true` will return only archived badges
  * `false` (default) will return only unarchived badges
  * `any` will return badges regardless of archived status

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "badges": [
    {
      "id": 1,
      "slug": "badge-slug",
      "name": "Badge Name",
      "strapline": "Badge strapline.",
      "earnerDescription": "Badge description for potential earners.",
      "consumerDescription": "Badge description for interested consumers.",
      "issuerUrl": "http://issuersite.com",
      "rubricUrl": "http://issuersite.com/rubric",
      "timeValue": 0,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "created": "2014-05-21T19:22:09.000Z",
      "imageUrl": "http://issuersite.com/badge.png",
      "type": "badge type",
      "archived": false,
      "system": {
          "id": 1,
          "slug": "system-slug",
          "url": "http://systemsite.com",
          "name": "System Name",
          "email": "admin@systemsite.com",
          "imageUrl": "http://systemsite.com/image.jpg",
          "issuers": [ ]
      }
      "criteriaUrl": "http://issuersite.com/criteria",
      "criteria": [
          {
              "id": 1, 
              "description": "Criteria description.",
              "required": true,
              "note": "Note about criteria for assessor."
          },
          ...
      ],
      "categories": [ ],
      "tags": [ ],
      "milestones": [ ]
    },
    ...
  ]
}
```

#### Response structure

* badges `[ ]`
	* id
	* slug
	* name
	* strapline
	* earnerDescription
	* consumerDescription
	* issuerUrl
	* rubricUrl
	* timeValue
	* timeUnits
	* limit
	* unique
	* created
	* imageUrl
	* type
	* archived
	* system `[ ]`
		* id
		* slug
		* url
		* name
		* email
		* imageUrl
		* issuers `[ ]`
	* criteriaUrl
	* criteria `[ ]`
		* id
		* description
		* required
		* note
	* categories `[ ]`
	* tags `[ ]`
	* milestones `[ ]`


### Potential errors

*None*

## Retrieve Specific Badge

Retrieves a specific badge using its slug.

### Expected request

```
GET /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "badge": {
    "id": 1,
    "slug": "badge-slug",
    "name": "Badge Name",
    "strapline": "Badge strapline.",
    "earnerDescription": "Badge description for potential earners.",
    "consumerDescription": "Badge description for consumers.",
    "issuerUrl": "http://issuersite.com",
    "rubricUrl": "http://issuersite.com/rubric",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "created": "2014-05-21T19:22:09.000Z",
    "imageUrl": "http://issuersite.com/badge.png",
    "type": "badge type",
    "archived": false,
    "system": {
      "id": 1,
      "slug": "system-slug",
      "url": "http://systemsite.com",
      "name": "System Name",
      "email": "admin@systemsite.com",
      "imageUrl": "http://systemsite.com/image.jpg",
      "issuers": [ ]
    },
    "criteriaUrl": "http://issuersite.com/criteria",
    "criteria": [
      {
        "id": 1,
        "description": "criteria description",
        "required": 1,
        "note": "note for assessor"
      },
      ...
    ],
    "categories": [ ],
    "tags": [ ],
    "milestones": [ ]
  }
}
```

#### Response structure

* badge
	* id
	* slug
	* name
	* strapline
	* earnerDescription
	* consumerDescription
	* issuerUrl
	* rubricUrl
	* timeValue
	* timeUnits
	* limit
	* unique
	* created
	* imageUrl
	* type
	* archived
	* system `[ ]`
		* id
		* slug
		* url
		* name
		* email
		* imageUrl
		* issuers `[ ]`
	* criteriaUrl
	* criteria `[ ]`
		* id
		* description
		* required
		* note
	* categories `[ ]`
	* tags `[ ]`
	* milestones `[ ]`

### Potential errors

* **Badge not found**

 ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find badge field: `slug`, value: <attempted-slug>"
  }
```

## `Create New Badge`

Creates a new badge in a system, issuer or program (_or updates an existing badge_).

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /systems/:systemSlug/badges HTTP/1.1
POST /systems/:systemSlug/issuers/:issuerSlug/badges HTTP/1.1
POST /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges HTTP/1.1
```

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **slug** | _required_ | Short, computer-friendly name for the badge. Good slugs are lowercase and use dashes instead of spaces, e.g. `reading-badge`. Maximum of 50 characters and each badge must have a unique slug.
| **name** | _required_ | Name of the badge. Maximum 255 characters.
| **strapline** | _optional_ | Short tagline style description of the badge. Maximum 140 characters.
| **earnerDescription** | _required_ | Description of the badge for potential earners.
| **consumerDescription** | _required_ | Description of the badge for consumers viewing it.
| **issuerUrl** | _optional_ | URL for badge issuer.
| **rubricUrl** | _optional_ | Link to any rubric material associated with the badge.
| **timeValue** | _optional_ | Badges can be associated with a time limit for earning.
| **timeUnits** | _optional_ | Time values can be expressed as `minutes`, `hours`, `days` or `weeks`.
| **limit** | _optional_ | Badges can be awarded to a fixed maximum number of earners.
| **unique** | _required_ | Boolean indicator of badge uniqueness.
| **image** OR **imageUrl** | _required_ | Image for the program. Should be either multipart data or a URL.
| **archived** | _optional_ | Boolean indicating archived status for badge.
| **criteriaUrl** | _required_ | Link to badge criteria.
| **criteria** | _optional_ | Array of criteria items - each criteria should include `description` and `required` status plus optional `note` for badge reviewers.
| **type** | _required_ | Short string representing badge type. Maximum 255 characters.
| **categories** | _optional_ | Array of category names for the badge.
| **tags** | _optional_ | Array of tag names for the badge.
| **milestones** | _optional_ | Array of [milestones](milestones.md).

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "badge": {
    "id": 1,
    "slug": "badge-slug",
    "name": "Badge Name",
    "strapline": "Badge strapline.",
    "earnerDescription": "Badge description for potential earners.",
    "consumerDescription": "Badge description for consumers.",
    "issuerUrl": "http://issuersite.com",
    "rubricUrl": "http://issuersite.com/rubric",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "created": "2014-05-21T19:22:09.000Z",
    "imageUrl": "http://issuersite.com/badge.png",
    "type": "badge type",
    "archived": false,
    "system": {
      "id": 1,
      "slug": "system-slug",
      "url": "http://systemsite.com",
      "name": "System Name",
      "email": "admin@systemsite.com",
      "imageUrl": "http://systemsite.com/image.jpg",
      "issuers": [ ]
    },
    "criteriaUrl": "http://issuersite.com/criteria",
    "criteria": [
      {
        "id": 1,
        "description": "criteria description",
        "required": 1,
        "note": "note for assessor"
      },
      ...
    ],
    "categories": [ ],
    "tags": [ ],
    "milestones": [ ]
  }
}
```

#### Response structure

* status
* badge
	* id
	* slug
	* name
	* strapline
	* earnerDescription
	* consumerDescription
	* issuerUrl
	* rubricUrl
	* timeValue
	* timeUnits
	* limit
	* unique
	* created
	* imageUrl
	* type
	* archived
	* system `[ ]`
		* id
		* slug
		* url
		* name
		* email
		* imageUrl
		* issuers `[ ]`
	* criteriaUrl
	* criteria `[ ]`
		* id
		* description
		* required
		* note
	* categories `[ ]`
	* tags `[ ]`
	* milestones `[ ]`

### Potential errors

* **Invalid data**

 ```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
```

```json
  {
    "code": "ValidationError",
    "message": "Could not validate required fields",
    "details": [
      {
        "message": "String is not in range",
        "field": "name",
        "value": "..."
      },
      ...
    ]
  }
```

* **Duplicate entry**

```
  HTTP/1.1 409 Conflict
  Content-Type: application/json
```

```json
  {
    "code": "ResourceConflict",
    "error": "badge with that `slug` already exists",
    "details": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge strapline.",
      "earnerDescription": "Badge description for earners.",
      "consumerDescription": "Badge description for consumers.",
      "issuerUrl": "http://issuersite.com",
      "rubricUrl": "http://issuersite.com/rubric",
      "criteriaUrl": "http://issuersite.com/criteria",
      "timeValue": 10,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "imageUrl": "http://issuersite.com/badge.png",
      "archived": false
    }
  }
```

## Update a Badge

Updates an existing badge.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
PUT /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
PUT /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug HTTP/1.1
```

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **slug** | Short, computer-friendly name for the badge. Good slugs are lowercase and use dashes instead of spaces, e.g. `reading-badge`. Maximum of 50 characters and each badge must have a unique slug.
| **name** | Name of the badge. Maximum 255 characters.
| **strapline** | Short tagline style description of the badge. Maximum 140 characters.
| **earnerDescription** | Description of the badge for potential earners.
| **consumerDescription** | Description of the badge for consumers viewing it.
| **issuerUrl** | URL for badge issuer.
| **rubricUrl** | Link to any rubric material associated with the badge.
| **timeValue** | Badges can be associated with a time limit for earning.
| **timeUnits** | Time values can be expressed as `minutes`, `hours`, `days` or `weeks`.
| **limit** | Badges can be awarded to a fixed maximum number of earners.
| **unique** | Boolean indicator of badge uniqueness.
| **image** OR **imageUrl** | Image for the program. Should be either multipart data or a URL.
| **archived** | Boolean indicating archived status for badge.
| **criteriaUrl** | Link to badge criteria.
| **criteria** | Array of criteria items - each criteria should include `description` and `required` status plus optional `note` for badge reviewers.
| **type** | Short string representing badge type. Maximum 255 characters.
| **categories** | Array of category names for the badge.
| **tags** | Array of tag names for the badge.
| **milestones** | Array of [milestones](milestones.md).

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "updated",
  "badge": {
    "id": 1,
    "slug": "badge-slug",
    "name": "Badge Name",
    "strapline": "Badge strapline.",
    "earnerDescription": "Badge description for potential earners.",
    "consumerDescription": "Badge description for consumers.",
    "issuerUrl": "http://issuersite.com",
    "rubricUrl": "http://issuersite.com/rubric",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "created": "2014-05-21T19:22:09.000Z",
    "imageUrl": "http://issuersite.com/badge.png",
    "type": "badge type",
    "archived": false,
    "system": {
      "id": 1,
      "slug": "system-slug",
      "url": "http://systemsite.com",
      "name": "System Name",
      "email": "admin@systemsite.com",
      "imageUrl": "http://systemsite.com/image.jpg",
      "issuers": [ ]
    },
    "criteriaUrl": "http://issuersite.com/criteria",
    "criteria": [
      {
        "id": 1,
        "description": "criteria description",
        "required": 1,
        "note": "note for assessor"
      },
      ...
    ],
    "categories": [ ],
    "tags": [ ],
    "milestones": [ ]
  }
}
```

#### Response structure

* status
* badge
	* id
	* slug
	* name
	* strapline
	* earnerDescription
	* consumerDescription
	* issuerUrl
	* rubricUrl
	* timeValue
	* timeUnits
	* limit
	* unique
	* created
	* imageUrl
	* type
	* archived
	* system `[ ]`
		* id
		* slug
		* url
		* name
		* email
		* imageUrl
		* issuers `[ ]`
	* criteriaUrl
	* criteria `[ ]`
		* id
		* description
		* required
		* note
	* categories `[ ]`
	* tags `[ ]`
	* milestones `[ ]`

### Potential errors

* **Invalid data**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
```

```json
  {
    "code": "ValidationError",
    "message": "Could not validate required fields",
    "details": [
      {
        "message": "String is not in range",
        "field": "name",
        "value": "..."
      },
      ...
    ]
  }
```

* **Duplicate entry**

```
  HTTP/1.1 409 Conflict
  Content-Type: application/json
```

```json
  {
    "code": "ResourceConflict",
    "error": "badge with that `slug` already exists",
    "details": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "earnerDescription": "Badge Description",
      "consumerDescription": "Badge Description for Consumers",
      "issuerUrl": "http://example.org/issuer",
      "rubricUrl": "http://example.org/rubric",
      "criteriaUrl": "http://example.org/criteria",
      "timeValue": 10,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "imageUrl": "http://example.org/badge.png",
      "archived": false
    }
  }
```

## Delete a Badge

Deletes an existing badge.

### Expected request

```
DELETE /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
DELETE /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
DELETE /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "deleted",
  "badge": {
    "id": 1,
    "slug": "badge-slug",
    "name": "Badge Name",
    "strapline": "Badge strapline.",
    "earnerDescription": "Badge description for potential earners.",
    "consumerDescription": "Badge description for consumers.",
    "issuerUrl": "http://issuersite.com",
    "rubricUrl": "http://issuersite.com/rubric",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "created": "2014-05-21T19:22:09.000Z",
    "imageUrl": "http://issuersite.com/badge.png",
    "type": "badge type",
    "archived": false,
    "criteriaUrl": "http://issuersite.com/criteria",
    "criteria": [ ],
    "categories": [ ],
    "tags": [ ],
    "milestones": [ ]
  }
}
```

### Potential errors

* **Badge not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find badge field: `slug`, value: <attempted-slug>"
  }
```
