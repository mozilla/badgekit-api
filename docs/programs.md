# Programs

Programs represent the last level of badging admin in BadgeKit. Each program belongs to one [issuer](issuers.md), optionally along with other programs. Badges can be associated with a program, which could be a program of events grouping activities on a theme or subject area.

| NAME | VALUE |
|:---|:---|
| `id` | integer - _id from database entry_ |
| `slug` | string - _used to identify program in API endpoints_ |
| `url` | string |
| `name` | string |
| `description` | string |
| `email` | string |
| `imageUrl` | string |

## Endpoints

* [`GET /systems/<slug>/issuers/<slug>/programs`](#get-systemsslugissuersslugprograms)
* [`GET /systems/<slug>/issuers/<slug>/programs/<slug>`](#get-systemsslugissuersslugprogramsslug)
* [`POST /systems/<slug>/issuers/<slug>/programs`](#post-systemsslugissuersslugprograms)
* [`PUT /systems/<slug>/issuers/<slug>/programs/<slug>`](#put-systemsslugissuersslugprogramsslug)
* [`DELETE /systems/<slug>/issuers/<slug>/programs/<slug>`](#delete-systemsslugissuersslugprogramsslug)

## `GET /systems/<slug>/issuers/<slug>/programs`

Retrieves all available programs in the specified system and issuer.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug/programs HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "programs": [
  	{
  	  "id": 1,
  	  "slug": "program-slug",
  	  "url": "http://programsite.com",
  	  "name": "Program Name",
  	  "description": "Program description.",
  	  "email": "admin@programsite.com",
  	  "imageUrl": "http://programsite.com/image.jpg"
  	},
  	...
  ]
}
```
#### Response structure

* programs `[ ]`
 * id
 * slug
 * url
 * name
 * description
 * email
 * imageUrl

### Potential errors

*None*

## `GET /systems/<slug>/issuers/<slug>/programs/<slug>`

Retrieves a specific program using its slug.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "program": {
    "id": 1,
    "slug": "program-slug",
    "url": "http://programsite.com",
    "name": "Program Name",
    "description": "Program description.",
    "email": "admin@programsite.com",
    "imageUrl": "http://programsite.com/image.jpg"
  }
}
```

#### Response structure

* program
 * id
 * slug
 * url
 * name
 * description
 * email
 * imageUrl

### Potential errors

* **Program not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find program field: `slug`, value: `<attempted-slug>`"
  }
```

## `POST /systems/<slug>/issuers/<slug>/programs`

Creates a new program.

### Expected request

```
POST /systems/:systemSlug/issuers/:issuerSlug/programs HTTP/1.1
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|-------------------------|
| **slug** | required | Short, computer-friendly name for the program. Good slugs are lowercase and use dashes instead of spaces, e.g. `cpl-rahms-readers`. Maximum of 50 characters and each program must have a unique slug.
| **name** | required | Name of the program. Maximum of 255 characters.
| **url** | required | URL for the program. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | optional | A short, human-friendly description of the program. Maximum of 255 characters
| **email** | optional | Email address associated with the badge administrator of the program.
| **image** | optional | Image for the program. Should be either multipart data or a URL.

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "program": {
    "id": 1,
    "slug": "program-slug",
    "url": "http://programsite.com",
    "name": "Program Name",
    "description": "Program description.",
    "email": "admin@programsite.com",
    "imageUrl": "http://programsite.com/image.jpg"
  }
}
```

#### Response structure

* status
* program
  * id
  * slug
  * url
  * name
  * description
  * email
  * imageUrl

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
    "error": "program with that `slug` already exists",
    "details": {
      "slug": "program-slug",
      "name": "Program Name",
      "url": "http://programsite.com",
      "email": "admin@programsite.com",
      "description": "Program description."
    }
  }
```

## `PUT /systems/<slug>/issuers/<slug>/programs/<slug>`

Updates an existing program.

### Expected request

```
PUT /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug HTTP/1.1
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **slug** | Short, computer-friendly name for the program. Good slugs are lowercase and use dashes instead of spaces, e.g. `cpl-rahms-readers`. Maximum of 50 characters and each program must have a unique slug.
| **name** | Name of the program. Maximum of 255 characters.
| **url** | URL for the program. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | A short, human-friendly description of the program. Maximum of 255 characters
| **email** | Email address associated with the badge administrator of the program.
| **image** | Image for the program. Should be either multipart data or a URL.

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "updated",
  "program": {
    "id": 1,
    "slug": "program-slug",
    "url": "http://programsite.com",
    "name": Updated Program Name",
    "description": "Updated program description.",
    "email": "admin@programsite.com",
    "imageUrl": "http://programsite.com/image.jpg"
  }
}
```

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
    "error": "program with that `slug` already exists",
    "details": {
      "slug": "program-slug",
      "name": "Program Name",
      "url": "http://programsite.com",
      "email": "admin@programsite.com",
      "description": "Program description."
    }
  }
```

## `DELETE /systems/<slug>/issuers/<slug>/programs/<slug>`

Deletes an existing program.

### Expected request

```
DELETE /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "deleted",
  "program": {
    "slug": "program-slug",
    "name": "Program Name",
    "url": "http://programsite.com",
    "email": "admin@programsite.com",
    "description": "Program description."
  }
}
```

### Potential errors

* **Program not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find program field: `slug`, value: `<attempted-slug>`"
  }
```
