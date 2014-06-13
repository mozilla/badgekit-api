# Milestones

Milestones give issuers the ability to award badges in recognition that the earner has earned a set of other badges. A milestone badge therefore represents a higher-level achievement, with the contributing badges representing more granular badges, culminating in the milestone. A milestone badge can be defined as available to earners of a specific set of other badges.

__When an earner is awarded a set of badges that makes them eligible to earn a milestone badge, the API will automatically issue the milestone badge to the earner by creating a new badge instance.__

| NAME | VALUE |
|:---|:---|
| `id` | __integer__ - _id from database_ |
| `action` | __string__ - _can be `issue` or `queue-application`_ |
| `numberRequired` | __integer__ - _number of support badges required to earn the milestone badge_ |
| `primaryBadge` | __[badge](badges.md)__ - _the milestone badge itself_ |
| `supportBadges` | __array__ - _support [badges](badges.md) required to earn the milestone_ |

## Endpoints
* [`GET /systems/:slug/milestones`](#get-systemsslugmilestones)
* [`GET /systems/:slug/milestones/:milestoneId`](#get-systemsslugmilestonesmilestoneid)
* [`POST /systems/:slug/milestones`](#post-systemsslugmilestones)
* [`PUT /systems/:slug/milestones/:milestoneId`](#put-systemsslugmilestonesmilestoneid)
* [`DELETE /systems/:slug/milestones/:milestoneId`](#delete-systemsslugmilestonesmilestoneid)

## `GET /systems/:slug/milestones`

Retrieve milestones within a system.

### Expected request

```
GET /systems/<slug>/milestones
```

#### Available request parameters

* **`page`:** - page of results to return
* **`count`:** - count of results to return per page

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "milestones": [
        {
            "id": 1,
            "action": "issue",
            "numberRequired": 3,
            "primaryBadge": {
                "id": 4,
                "slug": "milestone-badge-slug",
                "name": "Milestone Badge Name",
                "strapline": "Milestone strapline.",
                "earnerDescription": "Milestone earner description.",
                "consumerDescription": "Milesotne consumer description.",
                "issuerUrl": "http://issuersite.com",
                "rubricUrl": "http://issuersite.com/rubric",
                "timeValue": 0,
                "timeUnits": "minutes",
                "evidenceType": "URL",
                "limit": 0,
                "unique": 0,
                "created": "2014-05-29T21:24:32.000Z",
                "type": "milestone badge type",
                "archived": false,
                "criteriaUrl": "http://issuersite.com/milestone-badge-slug/criteria",
                "criteria": [ ],
                "categories": [ ],
                "tags": [ ],
                "milestones": [ ]
            },
            "supportBadges": [
                {
                    "id": 1,
                    "slug": "support-badge-slug",
                    ...
                },
                ...
            ]
        }
    ]
}
```

#### Response structure

* milestones `[ ]`
 * id
 * action
 * numberRequired
 * primaryBadge ([badge](badges.md))
    * id
    * slug
    * strapline
    * earnerDescription
    * consumerDescription
    * issuerUrl
    * rubricUrl
    * timeValue
    * timeUnits
    * evidenceType
    * limit
    * unique
    * created
    * type
    * archived
    * criteriaUrl
    * criteria `[ ]`
    * categories `[ ]`
    * tags `[ ]`
    * milestones `[ ]`
 * supportBadges `[ ]`
    * id
    * slug
    * ...

### Potential errors

*None*

## `GET /systems/:slug/milestones/:milestoneId`

Retrieve a specific milestone using its ID.

### Expected request

```
GET /systems/<slug>/milestones/<id>
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "milestone": 
      {
          "id": 1,
          "action": "issue",
          "numberRequired": 3,
          "primaryBadge": {
              "id": 4,
              "slug": "milestone-badge-slug",
              "name": "Milestone Badge Name",
              "strapline": "Milestone strapline.",
              "earnerDescription": "Milestone earner description.",
              "consumerDescription": "Milesotne consumer description.",
              "issuerUrl": "http://issuersite.com",
              "rubricUrl": "http://issuersite.com/rubric",
              "timeValue": 0,
              "timeUnits": "minutes",
              "evidenceType": "URL",
              "limit": 0,
              "unique": 0,
              "created": "2014-05-29T21:24:32.000Z",
              "type": "milestone badge type",
              "archived": false,
              "criteriaUrl": "http://issuersite.com/milestone-badge-slug/criteria",
              "criteria": [ ],
              "categories": [ ],
              "tags": [ ],
              "milestones": [ ]
          },
          "supportBadges": [
              {
                  "id": 1,
                  "slug": "support-badge-slug",
                  ...
              },
              ...
          ]
      }
}
```

#### Response structure

* milestone
 * id
 * action
 * numberRequired
 * primaryBadge ([badge](badges.md))
    * id
    * slug
    * strapline
    * earnerDescription
    * consumerDescription
    * issuerUrl
    * rubricUrl
    * timeValue
    * timeUnits
    * evidenceType
    * limit
    * unique
    * created
    * type
    * archived
    * criteriaUrl
    * criteria `[ ]`
    * categories `[ ]`
    * tags `[ ]`
    * milestones `[ ]`
 * supportBadges `[ ]`
    * id
    * slug
    * ...

### Potential errors

* **Milestone not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "NotFoundError",
  "message": "Could not find milestone with `id` <attempted-id>"
}
```

## `POST /systems/:slug/milestones`

Create a new milestone.

### Expected request

```
POST /systems/<slug>/milestones
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **numberRequired** | required | Integer representing how many support badges are required to earn the milestone badge. |
| **primaryBadgeId** | required | Id of primary badge, which is the milestone badge itself. |
| **action** | optional | Can be `issue` or `queue-application`. |
| **supportBadges** | required | Array containing ids of support badges. |

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
    "status": "created",
    "milestone": {
         "id": 1,
         "action": "issue",
         "numberRequired": 3,
         "primaryBadge": {
             "id": 4,
             "slug": "milestone-badge-slug",
             "name": "Milestone Badge Name",
             "strapline": "Milestone strapline.",
             "earnerDescription": "Milestone earner description.",
             "consumerDescription": "Milesotne consumer description.",
             "issuerUrl": "http://issuersite.com",
             "rubricUrl": "http://issuersite.com/rubric",
             "timeValue": 0,
             "timeUnits": "minutes",
             "evidenceType": "URL",
             "limit": 0,
             "unique": 0,
             "created": "2014-05-29T21:24:32.000Z",
             "type": "milestone badge type",
             "archived": false,
             "criteriaUrl": "http://issuersite.com/milestone-badge-slug/criteria",
             "criteria": [ ],
             "categories": [ ],
             "tags": [ ],
             "milestones": [ ]
          },
        "supportBadges": [
            {
                "id": 1,
                "slug": "support-badge-slug",
                ...
            },
            ...
        ]
    }
}
```

#### Response structure

* status
* milestone
 * id
 * action
 * numberRequired
 * primaryBadge ([badge](badges.md))
    * id
    * slug
    * ...
 * supportBadges `[ ]`
    * id
    * slug
    * ...

#### Potential Errors

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
        "field": "id",
        "value": "..."
      },
      ...
    ]
  }
```

## `PUT /systems/:slug/milestones/:milestoneId`

Update an existing milestone.

### Expected request

```
PUT /systems/<slug>/milestones/<id>
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **numberRequired** | Integer representing how many support badges are required to earn the milestone badge. |
| **primaryBadgeId** | Id of primary badge which is the milestone badge. |
| **action** | Can be `issue` or `queue-application`. |
| **supportBadges** | Array containing ids of support badges. |

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "status": "updated",
    "milestone": {
         "id": 1,
         "action": "issue",
         "numberRequired": 3,
         "primaryBadge": {
             "id": 4,
             "slug": "milestone-badge-slug",
             "name": "Milestone Badge Name",
             "strapline": "Milestone strapline.",
             "earnerDescription": "Milestone earner description.",
             "consumerDescription": "Milesotne consumer description.",
             "issuerUrl": "http://issuersite.com",
             "rubricUrl": "http://issuersite.com/rubric",
             "timeValue": 0,
             "timeUnits": "minutes",
             "evidenceType": "URL",
             "limit": 0,
             "unique": 0,
             "created": "2014-05-29T21:24:32.000Z",
             "type": "milestone badge type",
             "archived": false,
             "criteriaUrl": "http://issuersite.com/milestone-badge-slug/criteria",
             "criteria": [ ],
             "categories": [ ],
             "tags": [ ],
             "milestones": [ ]
          },
        "supportBadges": [
            {
                "id": 1,
                "slug": "support-badge-slug",
                ...
            },
            ...
        ]
    }
}
```

#### Response structure

* status
* milestone
 * id
 * action
 * numberRequired
 * primaryBadge ([badge](badges.md))
    * id
    * slug
    * ...
 * supportBadges `[ ]`
    * id
    * slug
    * ...

#### Potential Errors

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
        "field": "id",
        "value": "..."
      },
      ...
    ]
  }
```

* **Milestone not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "NotFoundError",
  "message": "Could not find milestone with `id` <attempted-id>"
}
```

## `DELETE /systems/:slug/milestones/:milestoneId`

Delete an existing milestone.

### Expected request

```
DELETE /systems/<slug>/milestones/<id>
```

### Expected response

```json
{
  "status": "deleted"
}
```

### Potential errors

* **Milestone not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "NotFoundError",
  "message": "Could not find milestone with `id` <attempted-id>"
}
```
