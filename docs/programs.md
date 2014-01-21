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
  
  {
    "error": "not found"
  }
  ```

## `POST /programs`

Creates a new program.

### Expected request

```
POST /programs HTTP/1.1

{
  "name": "Program Name",
  "slug": "program-slug",
  "description": "Program Description"
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

```
PUT /programs/<slug> HTTP/1.1

{
  "name": "New Program Name",
  "slug": "new-program-slug",
  "description": "New Program Description"
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

{
  "status": "deleted"
}
```

### Potential errors

* **Program not found**

  ```
  HTTP/1.1 404 Not Found
  
  {
    "error": "not found"
  }
  ```
