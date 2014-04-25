# Programs

## Retrieve all programs, filtered by system and issuer.

Retrieves all available programs.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug/programs HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "programs": [
  	{
  	  "name": "Program Name",
  	  "slug": "program-slug",
  	  "description": "Program description"
  	},
  	...
  ]
}
```

### Potential errors

*None*

## Retrieve a specific program

Retrieves a specific program.

### Expected request

```
GET /systems/:systemSlug/issuers/:issuerSlug/programs/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "program": {
    "name": "Program Name",
    "slug": "program-slug",
    "description": "Program Description"
  }
}
```

### Potential errors

* **Program not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json

  {
    "code": "ResourceNotFound",
    "message": "Could not find program with slug `<attempted slug>`"
  }
  ```

## Create a new program

Creates a new program.

### Expected request

```
POST /systems/:systemSlug/issuers/:issuerSlug/programs HTTP/1.1
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.


<a name="post-parameters"></a>

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

{
  "status": "created",
  "program": {
    "slug": "program-slug",
    "name": "Program Name",
    "url": "https://example.org/program/",
    "email": "program-badges@example.org",
    "description": "Program Description"
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
    "error": program with that `slug` already exists",
    "details": {
      "slug": "program-slug",
      "name": "Program Name",
      "url": "https://example.org/program/",
      "email": "program-badges@example.org",
      "description": "Program Description"
    }
  }
  ```

## Update an existing program

Updates an existing program.

### Expected request

```
PUT /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug HTTP/1.1
```
Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

<a href="#post-parameters">See above for parameters.</a> You only have to pass in the fields you are updating. Any fields that are not represented will be left unchanged.

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "updated",
  "program": {
    "slug": "program-slug",
    "name": Updated Program Name",
    "url": "https://example.org/program/",
    "email": "program-badges@example.org",
    "description": "Updated Program Description"
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
    "error": "program with that `slug` already exists",
    "details": {
      "slug": "program-slug",
      "name": "Program Name",
      "url": "https://example.org/program/",
      "email": "program-badges@example.org",
      "description": "Program Description"
    }
  }
  ```

## Delete a program

Deletes an existing program.

### Expected request

```
DELETE /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "deleted",
  "program": {
    "slug": "program-slug",
    "name": "Program Name",
    "url": "https://example.org/program/",
    "email": "program-badges@example.org",
    "description": "Program Description"
  }
}
```

### Potential errors

* **Program not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json

  {
    "code": "ResourceNotFound",
    "message": "Could not find program with slug `<attempted slug>`"
  }
  ```
