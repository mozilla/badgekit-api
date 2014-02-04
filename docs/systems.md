# Systems

## `GET /systems`

Retrieves all available systems.

### Expected request

```
GET /systems HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "systems": [
  	{
  	  "name": "System Name",
  	  "slug": "system-slug",
  	  "description": "System description"
  	},
  	...
  ]
}
```

### Potential errors

*None*

## `GET /systems/<slug>`

Retrieves a specific system.

### Expected request

```
GET /systems/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "system": {
    "name": "System Name",
    "slug": "system-slug",
    "description": "System Description"
  }
}
```

### Potential errors

* **System not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  
  {
    "error": "not found"
  }
  ```

## `POST /systems`

Creates a new system.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /systems HTTP/1.1
Content-Type: application/json

{
  "name": "System Name",
  "slug": "system-slug",
  "description": "System Description"
}
```

```
POST /systems HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=System%20Name&slug=system-slug&description=System%20Description
```

```
POST /systems HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

System Name
--…
content-disposition: form-data; name="slug"

system-slug
--…
content-disposition: form-data; name="description"

System Description
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
    "error": "A system with that `slug` already exists",
    "received": {
      "name": "System Name",
      "slug": "system-slug",
      "description": "System Description"
    }
  }
  ```

## `PUT /systems/<slug>`

Updates an existing system.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /systems/<slug> HTTP/1.1
Content-Type: application/json

{
  "name": "New System Name",
  "slug": "new-system-slug",
  "description": "New System Description"
}
```

```
PUT /systems/<slug> HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=New%20System%20Name&slug=new-system-slug&description=New%20System%20Description
```

```
PUT /systems/<slug> HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

New System Name
--…
content-disposition: form-data; name="slug"

new-system-slug
--…
content-disposition: form-data; name="description"

New System Description
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
    "error": "A system with that `slug` already exists",
    "received": {
      "name": "New System Name",
      "slug": "new-system-slug",
      "description": "New System Description"
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

{
  "status": "deleted"
}
```

### Potential errors

* **System not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  
  {
    "error": "not found"
  }
  ```
