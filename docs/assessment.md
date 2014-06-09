# Assessment

Badges can be issued following assessment of earner applications. Issuers can allow earners to submit applications for badges, forwarding these applications to the API. Reviewers can then assess pending applications, making awarding decisions and submitting their reviews. When a review is submitted, issuers can detect this at their [webhook](webhooks.md). Typically an issuer will respond to an approved review by offering the earner the badge, creating a [badge instance](issuing.md) and marking the application as processed using the updating endpoint below.

Assessment therefore involves two objects in BadgeKit API: applications and reviews.

## Applications

| NAME | VALUE |
|:---|:---|
| `id` | __integer__ - _id from database_ |
| `slug` | __string__ |
| `learner` | __email address__ - _earner email_ |
| `created` | __timestamp__ |
| `assignedTo` | __string__ - _email address for assigned reviewer_ |
| `assignedExpiration` | __timestamp__ - _expiry date for assigned reviewer to complete review, after which another reviewer can be assigned_ |
| `badge` | [badge](badges.md) - _badge applied for_ |
| `processed` | __timestamp__ - _e.g. set when review is submitted or when badge instance is created_ |
| `evidence` | __array__ - _each evidence item can include: `url`, `mediaType` (which can be `image` or `link`) and `reflection` (which is a string)_ |

## Reviews

| NAME | VALUE |
|:---|:---|
| `id` | __integer__ - _id from database_ |
| `slug` | __string__ |
| `author` | __email address__ - _reviewer email_ |
| `comment` | __string__ - _applicant feedback_ |
| `reviewItems` | __array__ - _one for each criteria item in the badge; each reviewItem can include: `criterionId`, `satisfied` status and `comment`_ |
| `approved` | __boolean__ - _indicates success of application_ |

## Endpoints

* [Retrieve Applications](#retrieve-applications)
 * `GET /systems/:slug/applications`
 * `GET /systems/:slug/issuers/:slug/applications`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/applications`
 * `GET /systems/:slug/badges/:slug/applications`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/applications`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications`
* [Retrieve a Specific Application](#retrieve-a-specific-application)
 * `GET /systems/:slug/badges/:slug/applications/:slug`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug`
* [Submit an Application](#submit-an-application)
 * `POST /systems/:slug/badges/:slug/applications`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/applications`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications`
* [Update an Application](#update-an-application)
 * `PUT /systems/:slug/badges/:slug/applications/:slug`
 * `PUT /systems/:slug/issuers/:slug/badges/:slug/applications/:slug`
 * `PUT /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug`
* [Delete an Application](#delete-an-application)
 * `DELETE /systems/:slug/badges/:slug/applications/:slug`
 * `DELETE /systems/:slug/issuers/:slug/badges/:slug/applications/:slug`
 * `DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug`
* [Retrieve Application Reviews](#retrieve-application-reviews)
 * `GET /systems/:slug/badges/:slug/applications/:slug/reviews`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews`
* [Retrieve a Specific Review](#retrieve-a-specific-review)
 * `GET /systems/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug`
* [Submit an Application Review](#submit-an-application-review)
 * `POST /systems/:slug/badges/:slug/applications/:slug/reviews`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews`
* [Update a Review](#update-a-review)
 * `PUT /systems/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `PUT /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `PUT /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug`
* [Delete a Review](#delete-a-review)
 * `DELETE /systems/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `DELETE /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug`
 * `DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug`

## Retrieve Applications

Retrieve existing applications within a system, issuer or program or for a specific badge.

### Expected request

```
GET /systems/:slug/applications
GET /systems/:slug/issuers/:slug/applications
GET /systems/:slug/issuers/:slug/programs/:slug/applications
GET /systems/:slug/badges/:slug/applications
GET /systems/:slug/issuers/:slug/badges/:slug/applications
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "applications": [
        {
            "id": 1,
            "slug": "application-slug",
            "learner": "earner@adomain.com",
            "created": "2014-05-29T18:24:59.000Z",
            "assignedTo": null,
            "assignedExpiration": null,
            "badge": {
                ...
            },
            "processed": null,
            "evidence": [
                {
                    "url": null,
                    "mediaType": null,
                    "reflection": "I did things relevant to the badge..."
                },
                {
                    "url": "http://issuersite.com/uploaded-image.jpg",
                    "mediaType": "image",
                    "reflection": "A picture of my evidence."
                },
                {
                    "url": "http://awebsite.com/evidence.html",
                    "mediaType": "link",
                    "reflection": "My website where I did things."
                }
            ]
        },
        ...
    ]
}
```

#### Response structure

* applications `[ ]`
	* id
	* slug
	* learner
	* created
	* assignedTo
	* assignedExpiration
	* [badge](badges.md)
	* processed
	* evidence `[ ]`
		* url
		* mediaType
		* reflection

### Potential errors

*None*

## Retrieve a Specific Application

Retrieve the details for a specific application using its slug.

### Expected request

```
GET /systems/:slug/badges/:slug/applications/:slug
GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "application": 
      {
          "id": 1,
          "slug": "application-slug",
          "learner": "earner@adomain.com",
          "created": "2014-05-29T18:24:59.000Z",
          "assignedTo": null,
          "assignedExpiration": null,
          "badge": {
              ...
          },
          "processed": null,
          "evidence": [
              {
                  "url": null,
                  "mediaType": null,
                  "reflection": "I did things relevant to the badge..."
              },
              {
                  "url": "http://issuersite.com/uploaded-image.jpg",
                  "mediaType": "image",
                  "reflection": "A picture of my evidence."
              },
              {
                  "url": "http://awebsite.com/evidence.html",
                  "mediaType": "link",
                  "reflection": "My website where I did things."
              }
          ]
      },
      ...
  ]
}
```

#### Response structure

* application
	* id
	* slug
	* learner
	* created
	* assignedTo
	* assignedExpiration
	* [badge](badges.md)
	* processed
	* evidence `[ ]`
		* url
		* mediaType
		* reflection

### Potential errors

* **Application not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "ResourceNotFound",
  "message": "Could not find application field: `slug`, value: <attempted-slug>"
}
```

## Submit an Application

Post an earner application for a badge. _If you're using the BadgeKit Web app, submitted applications appear there for review._

### Expected request

```
POST /systems/:slug/badges/:slug/applications
POST /systems/:slug/issuers/:slug/badges/:slug/applications
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **learner** | required | The email address for the earner applying. |
| **evidence** | optional | Array including evidence items - each item can include `reflection`, `mediaType` and `url`. |
| **assignedTo** | optional | Email of reviewer application is assigned to. |
| **assignedExpiration** | optional | Expiry date for assigned reviewer to complete review. |

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
    "status": "created",
    "application": 
    {
        "id": 1,
        "slug": "abcdef123456",
        "learner": "earner@example.com",
        "created": "2014-05-06T12:24:45.000Z",
        "assignedTo": null,
        "assignedExpiration": null,
        "badge": 
        {
            ...
        },

        "processed": null,
        "evidence": 
        [
            {
                "url": "http://awebsite.com/page",
                "mediaType": "link",
                "reflection": "I did great stuff."
            },
            ...
        ]
    }
}
```

## Response structure

* status
* application
 * id
 * slug
 * learner
 * created
 * assignedTo
 * assignedExpiration
 * [badge](badges.md)
 * processed
 * evidence `[ ]`
    * url
    * mediaType
    * reflection

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
        "field": "learner",
        "value": "..."
      },
      ...
    ]
  }
```

## Update an Application

Update an existing application - a typical use of this endpoint would be to mark an application as processed, for example following review and badge issuing.

### Expected request

```
PUT /systems/:slug/badges/:slug/applications/:slug
PUT /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
PUT /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **learner** | The email address for the earner applying. |
| **evidence** | Array including evidence items - each item can include `reflection`, `mediaType` and `url`. |
| **assignedTo** | Email of reviewer application is assigned to. |
| **assignedExpiration** | Expiry date for assigned reviewer to complete review. |
| **processed** | Timestamp indicating application has been processed. |

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response


```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "status": "updated",
    "application": 
    {
        "id": 1,
        "slug": "abcdef123456",
        "learner": "earner@example.com",
        "created": "2014-05-06T12:24:45.000Z",
        "assignedTo": null,
        "assignedExpiration": null,
        "badge": 
        {
            ...
        },

        "processed": "2014-05-06T12:24:45.000Z",
        "evidence": 
        [
            {
                "url": "http://awebsite.com/page",
                "mediaType": "link",
                "reflection": "I did great stuff."
            }
        ]
    }
}
```

#### Response structure

* status
* application
 * id
 * slug
 * learner
 * created
 * assignedTo
 * assignedExpiration
 * [badge](badges.md)
 * processed
 * evidence `[ ]`
    * url
    * mediaType
    * reflection

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
        "message": "Invalid email",
        "field": "learner",
        "value": "..."
      },
      ...
    ]
  }
```

## Delete an Application

Delete an existing application.

### Expected request

```
DELETE /systems/:slug/badges/:slug/applications/:slug
DELETE /systems/:slug/issuers/:slug/badges/:slug/applications/:slug
DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "status": "deleted",
    "application": {
        "id": 1,
        "slug": "abcde12345",
        "learner": "earner@adomain.com",
        "created": "2014-05-29T18:24:59.000Z",
        "assignedTo": null,
        "assignedExpiration": null,
        "badge": null,
        "processed": null,
        "evidence": [ ]
    }

}
```

### Potential errors

* **Application not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find application field: `slug`, value: <attempted-slug>"
  }
```

## Retrieve Application Reviews

Retrieve reviews for specific applications.

### Expected request

```
GET /systems/:slug/badges/:slug/applications/:slug/reviews
GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "reviews": [
        {
            "id": 1,
            "slug": "abcde12345",
            "author": "reviewer@issuersite.com",
            "comment": "fantastic work",
            "reviewItems": [
              {
                "criterionId": 1,
                "satisfied": 1,
                "comment": "perfect"
              },
            ...
            ]
        },
        ...
    ]
}
```

#### Response structure

* reviews `[ ]`
 * id
 * slug
 * author
 * comment
 * reviewItems `[ ]`
    * criterionId
    * satisfied
    * comment

### Potential errors

*None*

## Retrieve a Specific Review

Retrieve a specific application review.

### Expected request

```
GET /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
GET /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "review":
    {
        "id": 1,
        "slug": "abcde12345",
        "author": "reviewer@issuersite.com",
        "comment": "fantastic work",
        "reviewItems": [
          {
            "criterionId": 1,
            "satisfied": 1,
            "comment": "perfect"
          },
        ...
        ]
    }
}
```

#### Response structure

* reviews
 * id
 * slug
 * author
 * comment
 * reviewItems `[ ]`
    * criterionId
    * satisfied
    * comment

### Potential errors

* **Review not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find review field: `slug`, value <attempted-slug>"
  }
```

## Submit an Application Review

Post a review for a specific application. 

### Expected request

```
POST /systems/:slug/badges/:slug/applications/:slug/reviews
POST /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **author** | required | Email address of reviewer.
| **comment** | optional | Feedback for earner.
| **reviewItems** | optional | Array, each item includes `criterionId`, `satisfied` and `comment`.

### Expected response


```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
    "status": "created",
    "review": {
        "id": 1,
        "slug": "abcde12345",
        "author": "reviewer@issuersite.com",
        "comment": "fantastic work",
        "reviewItems": [
            {
                "criterionId": 1,
                "satisfied": 1,
                "comment": "perfect"
            },
            ...
        ]
    }

}
```

#### Response structure

* status
* review
 * id
 * slug
 * author
 * comment
 * reviewItems `[ ]`
    * criterionId
    * satisfied
    * comment

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
        "message": "Invalid email",
        "field": "author",
        "value": "..."
      },
      ...
    ]
  }
```

## Update a Review

Update an existing application review.

### Expected request

```
PUT /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
PUT /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
PUT /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **author** | Email address of reviewer.
| **comment** | Feedback for earner.
| **reviewItems** | Array, each item includes `criterionId`, `satisfied` and `comment`.

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
    "status": "updated",
    "review": {
        "id": 1,
        "slug": "abcde12345",
        "author": "someoneelse@issuersite.com",
        "comment": "fantastic work",
        "reviewItems": [
            {
                "criterionId": 1,
                "satisfied": 1,
                "comment": "perfect"
            },
            ...
        ]
    }
}
```

#### Response structure

* status
* review
 * id
 * slug
 * author
 * comment
 * reviewItems `[ ]`
    * criterionId
    * satisfied
    * comment

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
        "message": "Invalid email",
        "field": "author",
        "value": "..."
      },
      ...
    ]
  }
```

## Delete a Review

Delete an existing application review.

### Expected request

```
DELETE /systems/:slug/badges/:slug/applications/:slug/reviews/:slug
DELETE /systems/:slug/issuers/:slug/badges/:slug/applications/:slug/reviews/:slug
DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/applications/:slug/reviews/:slug
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
        "slug": "abcde12345",
        "author": "reviewer@issuersite.com",
        "comment": "fantastic work",
        "reviewItems": [
            {
                "criterionId": 1,
                "satisfied": 1,
                "comment": "perfect"
            },
            ...
        ]
    }
}
```

#### Response structure

* status
* review
 * id
 * slug
 * author
 * comment
 * reviewItems `[ ]`
    * criterionId
    * satisfied
    * comment

### Potential errors

* **Review not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find review field: `slug`, value: <attempted-slug>"
  }
```
