# Systems

A system represents the top admin level within BadgeKit - an instance can contain one or more systems, a system can contain one or more issuers and an issuer can contain one or more programs. All BadgeKit API needs to function is one system, which badges will be automatically included in. Badges can optionally be associated with a system, issuer or program.

| NAME | VALUE |
|:---|:---|
| `id` | integer - _id from database entry_ |
| `slug` | string - _used to identify system in API endpoints_ |
| `url` | string |
| `name` | string |
| `email` | string |
| `imageUrl` | string |
| `issuers` | array - _[issuers](issuers.md) in the system (may contain [programs](programs.md))_ |

## `GET /systems`

Retrieves all available systems in the BadgeKit API instance.

### Expected request

```
GET /systems HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "systems": [
    {
      "id": 1,
      "slug": "system-slug",
      "url": "http://systemsite.com",
      "name": "System Name",
      "email": "admin@systemsite.com",
      "imageUrl": "http://systemsite.com/image.jpg",
      "issuers": [
        {
          "id": 1,
          "slug": "issuer-slug",
          "url": "http://issuersite.com",
          "name": "Issuer Name",
          "description": "Issuer description.",
          "email": "admin@issuersite.com",
          "imageUrl": "http://issuersite.com/image.jpg",
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
        },
          ...
      ]
  },
  	...
  ]
}
```

#### Response structure

* systems `[ ]`
 * id
 * slug
 * url
 * name
 * email
 * imageUrl
 * [issuers](issuers.md) `[ ]`
   * [programs](programs.md) `[ ]`

### Potential errors

*None*

## `GET /systems/<slug>`

Retrieves a specific system using its slug.

### Expected request

```
GET /systems/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "system": {
    "id": 1,
    "slug": "system-slug",
    "url": "http://systemsite.com",
    "name": "System Name",
    "email": "admin@systemsite.com",
    "imageUrl": "http://systemsite.com/image.jpg",
    "issuers": [
    {
      "id": 1,
      "slug": "issuer-slug",
      "url": "http://issuersite.com",
      "name": "Issuer Name",
      "description": "Issuer description.",
      "email": "admin@issuersite.com",
      "imageUrl": "http://issuersite.com/image.jpg",
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
    },
      ...
    ]
  }
}
```

#### Response structure

* system
 * id
 * slug
 * url
 * name
 * email
 * imageUrl
 * [issuers](issuers.md) `[ ]`
   * [programs](programs.md) `[ ]`

### Potential errors

* **System not found**

```
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "ResourceNotFound",
  "message": "Could not find system field: `slug`, value: <attempted-slug>"
}
```

## `POST /systems`

Creates a new system.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|-------------------------|
| **slug** | required | Short, computer-friendly name for the system. Good slugs are lowercase and use dashes instead of spaces, e.g. `city-of-chicago`. Maximum of 50 characters and each system must have a unique slug.
| **name** | required | Name of the system. Maximum of 255 characters.
| **url** | required | URL for the system. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | optional | A short, human-friendly description of the system. Maximum of 255 characters
| **email** | optional | Email address associated with the badge administrator of the system.
| **image** | optional | Image for the system. Should be either multipart data or a URL.

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "system": {
    "id": 1,
    "slug": "system-slug",
    "name": "System Name",
    "url": "http://systemsite.com",
    "email": "admin@systemsite.com",
    "imageUrl": "http://systemsite.com/image.jpg",
    "issuers": [ ]
  }
}
```

#### Response structure

* status
  * system
    * id
    * slug
    * name
    * url
    * email
    * imageUrl
    * issuers `[ ]`

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
    "error": system with that `slug` already exists",
    "details": {
      "slug": "system-slug",
      "name": "System Name",
      "url": "http://systemsite.com",
      "email": "admin@systemsite.com",
      "description": "System Description"
    }
  }
  ```

## `PUT /systems/<slug>`

Updates an existing system.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|-------------------------|
| **slug** | required | Short, computer-friendly name for the system. Good slugs are lowercase and use dashes instead of spaces, e.g. `city-of-chicago`. Maximum of 50 characters and each system must have a unique slug.
| **name** | required | Name of the system. Maximum of 255 characters.
| **url** | required | URL for the system. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | optional | A short, human-friendly description of the system. Maximum of 255 characters
| **email** | optional | Email address associated with the badge administrator of the system.
| **image** | optional | Image for the system. Should be either multipart data or a URL.

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "updated",
  "system": {
    "id": 1,
    "slug": "system-slug",
    "name": "System Name",
    "url": "http://systemsite.com",
    "email": "admin@systemsite.com",
    "imageUrl": "http://systemsite.com/image.jpg",
    "issuers": [ ]
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
    "error": "system with that `slug` already exists",
    "details": {
      "slug": "system-slug",
      "name": "System Name",
      "url": "http://systemsite.com",
      "email": "admin@systemsite.com",
      "description": "System Description"
    }
  }
```

## `DELETE /systems/<slug>`

Deletes an existing system.

### Expected request

```
DELETE /systems/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "deleted",
  "system": {
    "id": 1,
    "slug": "system-slug",
    "name": "System Name",
    "url": "http://systemsite.com",
    "email": "admin@systemsite.com",
    "imageUrl": "http://systemsite.com/image.jpg",
    "issuers": [ ]
  }
}
```

### Potential errors

* **System not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find system with slug `<attempted slug>`"
  }
```

## `GET /public/systems/<slug>`

Retrieves a specific public system.
