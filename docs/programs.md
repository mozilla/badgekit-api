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
    "error": "not found"
  }
  ```

## `POST /programs`

Creates a new program.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /programs HTTP/1.1
Content-Type: application/json

{
  "name": "Program Name",
  "slug": "program-slug",
  "description": "Program Description"
}
```

```
POST /programs HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Program%20Name&slug=program-slug&description=Program%20Description
```

```
POST /programs HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

Program Name
--…
content-disposition: form-data; name="slug"

program-slug
--…
content-disposition: form-data; name="description"

Program Description
--…--
```

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "created"
}
```

### Potential errors

* **Invalid data**
  
  ```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  
  {
    "errors": [
      {
        "name": "ValidatorError",
        "message": "String is not in range",
        "field": "name"
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
    "errors": [
      {
        "name": "ValidatorError",
        "message": "String is not in range",
        "field": "name"
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
    "error": "not found"
  }
  ```
