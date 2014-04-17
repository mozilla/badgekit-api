# Issuers

## Retrieve list of issuers

Retrieves all available issuers, filtered by system.

### Expected request

```
GET /systems/:systemSlug/issuers HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "issuers": [
  	{
  	  "name": "Issuer Name",
  	  "slug": "issuer-slug",
  	  "description": "Issuer description"
  	},
  	...
  ]
}
```

### Potential errors

*None*

## Retrieve a specific issuer

Retrieves a specific issuer.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "issuer": {
    "name": "Issuer Name",
    "slug": "issuer-slug",
    "description": "Issuer Description"
  }
}
```

### Potential errors

* **Issuer not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json

  {
    "code": "ResourceNotFound",
    "message": "Could not find issuer with slug `<attempted slug>`"
  }
  ```

## Create a new issuer

Creates a new issuer.

### Expected request

`/systems/:systemSlug/issuers/:issuerSlug`

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.


<a name="post-parameters"></a>

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

{
  "status": "created",
  "issuer": {
    "slug": "issuer-slug",
    "name": "Issuer Name",
    "url": "https://example.org/issuer/",
    "email": "issuer-badges@example.org",
    "description": "Issuer Description"
  }
}
```

### Potential errors

* **Invalid data**

  ```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json

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

  {
    "code": "ResourceConflict",
    "error": issuer with that `slug` already exists",
    "details": {
      "slug": "issuer-slug",
      "name": "Issuer Name",
      "url": "https://example.org/issuer/",
      "email": "issuer-badges@example.org",
      "description": "Issuer Description"
    }
  }
  ```

## Update an issuer

Updates an existing issuer.

### Expected request

`PUT /systems/:systemSlug/issuers/:issuerSlug`

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

<a href="#post-parameters">See above for parameters.</a> You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "updated",
  "issuer": {
    "slug": "issuer-slug",
    "name": Updated Issuer Name",
    "url": "https://example.org/issuer/",
    "email": "issuer-badges@example.org",
    "description": "Updated Issuer Description"
  }
}
```

### Potential errors

* **Invalid data**

  ```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json

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

  {
    "code": "ResourceConflict",
    "error": "issuer with that `slug` already exists",
    "details": {
      "slug": "issuer-slug",
      "name": "Issuer Name",
      "url": "https://example.org/issuer/",
      "email": "issuer-badges@example.org",
      "description": "Issuer Description"
    }
  }
  ```

## Delete an existing issuer

Deletes an existing issuer.

### Expected request

```
DELETE /system/:systemSlug/issuers/:issuerSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "deleted",
  "issuer": {
    "slug": "issuer-slug",
    "name": "Issuer Name",
    "url": "https://example.org/issuer/",
    "email": "issuer-badges@example.org",
    "description": "Issuer Description"
  }
}
```

### Potential errors

* **Issuer not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json

  {
    "code": "ResourceNotFound",
    "message": "Could not find issuer with slug `<attempted slug>`"
  }
  ```
