# Programs

## `GET /programs`

Retrieves all available programs.

### Expected request

```
GET /programs HTTP/1.1
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

## `GET /programs/<slug>`

Retrieves a specific program.

### Expected request

```
GET /programs/<slug> HTTP/1.1
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

## `POST /programs`

Creates a new program.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.


| Parameters             | Required        | Description              |
|:-----------------------|-----------------|-------------------------:|
| **name** | &#x2611; | Name of the program. Maximum of 255 characters.
| **image** | &#x2610; | Image for the program. Should be either multipart data or a URL.

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "created",
  "program": {
    "name": "Program Name",
    "slug": "program-slug",
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
      "name": "Program Name",
      "slug": "program-slug",
      "description": "Program Description"
    }
  }
  ```

## `PUT /programs/<slug>`

Updates an existing program.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /programs/<slug> HTTP/1.1
Content-Type: application/json

{
  "name": "New Program Name",
  "slug": "new-program-slug",
  "description": "New Program Description"
}
```

```
PUT /programs/<slug> HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=New%20Program%20Name&slug=new-program-slug&description=New%20Program%20Description
```

```
PUT /programs/<slug> HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

New Program Name
--…
content-disposition: form-data; name="slug"

new-program-slug
--…
content-disposition: form-data; name="description"

New Program Description
--…--
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "updated"
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
    "error": "A program with that `slug` already exists",
    "received": {
      "name": "New Program Name",
      "slug": "new-program-slug",
      "description": "New Program Description"
    }
  }
  ```

## `DELETE /programs/<slug>`

Deletes an existing program.

### Expected request

```
DELETE /programs/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "deleted"
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
