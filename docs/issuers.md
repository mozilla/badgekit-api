# Issuers

Issuers represent mid-level admin in BadgeKit. Each issuer belongs to a single [system](systems.md), optionally along with other issuers. An issuer can contain one or more [programs](programs.md). Badges can be associated with an issuer, which will typically be a single organization within a badging system, such as a library, museum or school.

| NAME | VALUE |
|:---|:---|
| `id` | integer - _id from database entry_ |
| `slug` | string - _used to identify issuer in API endpoints_ |
| `url` | string |
| `name` | string |
| `description` | string |
| `email` | string |
| `imageUrl` | string |
| `programs` | array - _[programs](programs.md) in the issuer_ |

## Endpoints

* [`GET /systems/<slug>/issuers`](#get-systemsslugissuers)
* [`GET /systems/<slug>/issuers/<slug>`](#get-systemsslugissuersslug)
* [`POST /systems/<slug>/issuers`](#post-systemsslugissuers)
* [`PUT /systems/<slug>/issuers/<slug>`](#put-systemsslugissuersslug)
* [`DELETE /systems/<slug>/issuers/<slug>`](#delete-systemsslugissuersslug)

## `GET /systems/<slug>/issuers`

Retrieves all available issuers in the specified system.

### Expected request

```
GET /systems/:systemSlug/issuers HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
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
```

#### Response structure

* issuers `[ ]`
 * id
 * slug
 * url
 * name
 * description
 * email
 * imageUrl
 * [programs](programs.md) `[ ]`

### Potential errors

*None*

## `GET /systems/<slug>/issuers/<slug>`

Retrieves a specific issuer using its slug.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "issuer": {
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
  }
}
```

#### Response structure

* issuer
 * id
 * slug
 * url
 * name
 * description
 * email
 * imageUrl
 * [programs](programs.md) `[ ]`

### Potential errors

* **Issuer not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find issuer field: `slug`, value `<attempted-slug>`"
  }
```

## `POST /systems/<slug>/issuers`

Creates a new issuer.

### Expected request

```
POST /systems/:systemSlug/issuers`
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|-------------------------|
| **slug** | required | Short, computer-friendly name for the issuer. Good slugs are lowercase and use dashes instead of spaces, e.g. `chicago-public-library`. Maximum of 50 characters and each issuer must have a unique slug.
| **name** | required | Name of the issuer. Maximum of 255 characters.
| **url** | required | URL for the issuer. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | optional | A short, human-friendly description of the issuer. Maximum of 255 characters
| **email** | optional | Email address associated with the badge administrator of the issuer.
| **image** | optional | Image for the issuer. Should be either multipart data or a URL.

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "status": "created",
  "issuer": {
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
  }
}
```

#### Response structure

* status
* issuer
  * id
  * slug
  * url
  * name
  * description
  * email
  * imageUrl
  * programs `[ ]`

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
    "error": "issuer with that `slug` already exists",
    "details": {
      "slug": "issuer-slug",
      "name": "Issuer Name",
      "url": "http://issuersite.com",
      "email": "admin@issuersite.com",
      "description": "Issuer description."
    }
  }
```

## `PUT /systems/<slug>/issuers/<slug>`

Updates an existing issuer.

### Expected request

```
PUT /systems/:systemSlug/issuers/:issuerSlug
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Description              |
|:-----------------------|--------------------------|
| **slug** | Short, computer-friendly name for the issuer. Good slugs are lowercase and use dashes instead of spaces, e.g. `chicago-public-library`. Maximum of 50 characters and each issuer must have a unique slug.
| **name** | Name of the issuer. Maximum of 255 characters.
| **url** | URL for the issuer. Must be fully qualified, e.g. https://www.example.org, **NOT** just  www.example.org.
| **description** | A short, human-friendly description of the issuer. Maximum of 255 characters
| **email** | Email address associated with the badge administrator of the issuer.
| **image** | Image for the issuer. Should be either multipart data or a URL.

You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "updated",
  "issuer": {
    "id": 1,
    "slug": "issuer-slug",
    "url": "http://issuersite.com",
    "name": "Updated Issuer Name",
    "description": "Updated Issuer Description",
    "email": "admin@issuersite.com",
    "imageUrl": "http://issuersite.com/image.jpg",
    "programs": [ ]
  }
}
```

#### Response structure

* status
* issuer
  * id
  * slug
  * url
  * name
  * description
  * email
  * imageUrl
  * programs `[ ]`

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
    "error": "issuer with that `slug` already exists",
    "details": {
      "slug": "issuer-slug",
      "name": "Issuer Name",
      "url": "http://issuersite.com",
      "email": "admin@issuersite.com",
      "description": "Issuer description."
    }
  }
  ```

## `DELETE /systems/<slug>/issuers/<slug>`

Deletes an existing issuer.

### Expected request

```
DELETE /systems/:systemSlug/issuers/:issuerSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "deleted",
  "issuer": {
    "id": 1,
    "slug": "issuer-slug",
    "url": "http://issuersite.com",
    "name": "Issuer Name",
    "description": "Issuer description.",
    "email": "admin@issuersite.com",
    "imageUrl": "http://issuersite.com/image.jpg",
    "programs": [ ]
  }
}
```

### Potential errors

* **Issuer not found**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
```

```json
  {
    "code": "ResourceNotFound",
    "message": "Could not find issuer field: `slug`, value: `<attempted-slug>`"
  }
```
