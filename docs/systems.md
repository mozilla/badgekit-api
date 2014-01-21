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
  
  {
    "error": "not found"
  }
  ```

## `POST /systems`

Creates a new system.

### Expected request

```
POST /systems HTTP/1.1

{
  "name": "System Name",
  "slug": "system-slug",
  "description": "System Description"
}
```

### Expected response

```
HTTP/1.1 201 Created

{
  "status": "created"
}
```

### Potential errors

* **Invalid data**
  
  ```
  HTTP/1.1 400 Bad Request
  
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

```
PUT /systems/<slug> HTTP/1.1

{
  "name": "New System Name",
  "slug": "new-system-slug",
  "description": "New System Description"
}
```

### Expected response

```
HTTP/1.1 200 OK

{
  "status": "updated"
}
```

### Potential errors

* **Invalid data**
  
  ```
  HTTP/1.1 400 Bad Request
  
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

{
  "status": "deleted"
}
```

### Potential errors

* **System not found**

  ```
  HTTP/1.1 404 Not Found
  
  {
    "error": "not found"
  }
  ```
