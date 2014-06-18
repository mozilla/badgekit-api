# Claim Codes

Earners can use claim codes to claim badges. For example, a claim code can be distributed at an event or given to the earner on completion of an achievement. The issuer site can facilitate issuing badges by allowing earners to submit claim codes.

| NAME | VALUE |
|:---|:---|
| `id` | __integer__ - _id from database entry_ |
| `code` | __string__ - _code used to claim a badge_ |
| `claimed` | __boolean__ |
| `email` | __string__ |
| `multiuse` | __boolean__ - _claim codes can be single use or multi-use_ |
| `badge` | [badge](badges.md) _claim code is for_ |

## Endpoints

* [Retrieve Claim Codes](#retrieve-claim-codes)
 * `GET /systems/:slug/badges/:slug/codes`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/codes`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes`
* [Retrieve Specific Claim Code](#retrieve-specific-claim-code)
 * `GET /systems/:slug/badges/:slug/codes/:code`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/codes/:code`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code`
* [Retrieve Badge from Claim Code](#retrieve-badge-from-claim-code)
 * `GET /systems/:slug/codes/:code`
 * `GET /systems/:slug/issuers/:slug/codes/:code`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/codes/:code`
* [Create Claim Code](#create-claim-code)
 * `POST /systems/:slug/badges/:slug/codes`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/codes`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes`
* [Create Random Code](#create-random-code)
 * `POST /systems/:slug/badges/:slug/codes/random`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/codes/random`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/random`
* [Delete Claim Code](#delete-claim-code)
 * `DELETE /systems/:slug/badges/:slug/codes/:code`
 * `DELETE /systems/:slug/issuers/:slug/badges/:slug/codes/:code`
 * `DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code`
* [Claim a Code](#claim-a-code)
 * `POST /systems/:slug/badges/:slug/codes/:code/claim`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/codes/:code/claim`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code/claim`

## Retrieve Claim Codes

Retrieves all claim codes for a badge within a system, issuer or program.

### Expected request

```
GET /systems/:slug/badges/:slug/codes
GET /systems/:slug/issuers/:slug/badges/:slug/codes
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes
```

#### Available request parameters

* **`page`:** - page of results to return
* **`count`:** - count of results to return per page

e.g. `/systems/<slug>/badges/<slug>/codes?count=2&page=1`

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "claimCodes": [
    {
      "id": 1,
      "code": "0fba9c4457",
      "claimed": false,
      "email": "someone@somewhere.com",
      "multiuse": false
    },
      ...
  ],
  "badge": {
    ...
  },
  "pageData": {
    "page": 1,
    "count": 2,
    "total": 4
  }
}
```

_`pageData` is returned when pagination parameters are used._

#### Response structure

* claimCodes `[ ]`
 * id
 * code
 * claimed
 * email
 * multiuse
* [badge](badges.md)

### Potential errors

*None*

## Retrieve Specific Claim Code

Retrieve the details for a specific claim code for a badge.

### Expected request

```
GET /systems/:slug/badges/:slug/codes/:code
GET /systems/:slug/issuers/:slug/badges/:slug/codes/:code
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "badge": {
    ...
  },
  "claimCode": {
    "id": 1,
    "code": "2f91d622dd",
    "claimed": false,
    "email": null,
    "multiuse": false
  }
}
```

#### Response structure

* [badge](badges.md)
* claimCode
 * id
 * code
 * claimed
 * email
 * multiuse

### Potential errors

* **Claim code not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
 "code": "ResourceNotFound",
 "message": "Could not find the request claim code: <attempted-code>"
}
```

## Retrieve Badge from Claim Code

Retrieve the details for a badge using a claim code within a system, issuer or program context.

### Expected request

```
GET /systems/:slug/codes/:code
GET /systems/:slug/issuers/:slug/codes/:code
GET /systems/:slug/issuers/:slug/programs/:slug/codes/:code
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
      "earnerDescription": "Description for earners.",
      "consumerDescription": "Description for consumers.",
      "issuerUrl": "http://issuersite.com",
      "rubricUrl": "http://issuersite.com/rubric",
      "timeValue": 0,
      "timeUnits": "minutes",
      "evidenceType": "URL",
      "limit": 0,
      "unique": 0,
      "created": "2014-05-21T19:22:09.000Z",
      "imageUrl": "http://issuersite.com/badeg.jpg",
      "type": "badge type",
      "archived": false,
      "system": {
        ...
      },
      "issuer": {
        ...
      },
      "program": {
        ...
      },
      "criteriaUrl": "http://issuersite.com/criteria",
      "criteria": [ ],
      "categories": [ ],
      "tags": [ ],
      "milestones": [ ],
      "claimed": 0
  }
}
```

#### Response structure

* [badge](badges.md)
 * ...
 * claimed

### Potential errors

* **Claim code not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
 "code": "ResourceNotFound",
 "message": "Could not find the request claim code: <attempted-code>"
}
```

## Create Claim Code

Create a claim code for a badge.

### Expected request

```
POST /systems/:slug/badges/:slug/codes
POST /systems/:slug/issuers/:slug/badges/:slug/codes
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **code** | required | The claim code you are creating. String with maximum length 255 characters. |
| **claimed** | optional | Boolean indicator of whether the badge has been claimed.
| **multiuse** | optional | Boolean indicator of whether the badge is multiuse or not (single use).
| **email** | optional |

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "claimCode": {
    "id": 1,
    "code": "abcde12345",
    "claimed": false,
    "multiuse": false
  },
  "badge": {
    ...
  }
}
```

#### Response structure

* status
* claimCode
 * id
 * code
 * claimed
 * multiuse
* [badge](badges.md)

#### Potential errors

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
        "field": "code",
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
    "error": "claimCode with that `code` already exists",
    "details": {
        ...
    }
  }
```

## Create Random Code

Creates a random claim code - BadgeKit API will generate the claim code using a random algorithm.

### Expected request

```
POST /systems/:slug/badges/:slug/codes/random
POST /systems/:slug/issuers/:slug/badges/:slug/codes/random
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/random
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **claimed** | optional | Boolean indicator of whether the badge has been claimed.
| **multiuse** | optional | Boolean indicator of whether the badge is multiuse or not (single use).
| **email** | optional |

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "claimCode": {
    "id": 1,
    "code": "abcde12345",
    "claimed": false,
    "multiuse": false
  },
  "badge": {
    ...
  }
}
```

#### Response structure

* status
* claimCode
 * id
 * code
 * claimed
 * multiuse
* [badge](badges.md)

### Potential errors

*None*

## Delete Claim Code

Delete a claim code.

### Expected request

```
DELETE /systems/:systemSlug/badges/:badgeSlug/codes/:code
DELETE /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/codes/:code
DELETE /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/codes/:code
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "deleted",
  "claimCode": {
    "id": 1,
    "code": "0fba9c4457",
    "claimed": false,
    "email": null,
    "multiuse": false
  },
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
    "evidenceType": "URL",
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

#### Response structure

* status
* claimCode
* [badge](badges.md)

### Potential errors

* **Claim code not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find claimCode field: `code`, value: <attempted-code>"
  }
```

## Claim a Code

Claim a code.

### Expected request

```
POST /systems/:slug/badges/:slug/codes/:code/claim
POST /systems/:slug/issuers/:slug/badges/:slug/codes/:code/claim
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/codes/:code/claim
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        |
|:-----------------------|-----------------|
| **email** | optional |

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "updated",
  "claimCode": {
    "id": 1,
    "code": "abcde12345",
    "claimed": false,
    "email": null,
    "multiuse": false
  },
  "badge": {
    ...
  }
}
```

#### Response structure

* status
* claimCode
 * id
 * code
 * claimed
 * email
 * multiuse
* [badge](badges.md)

### Potential errors

* **Claim code already claimed (if single use)**

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
 "code": "CodeAlreadyUsed",
 "message": "Claim code `code` has already been claimed"
}
```

* **Claim code not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
    "code": "ResourceNotFound",
    "message": "Could not find claimCode field: `code`, value: <attempted-code>"
}
```
