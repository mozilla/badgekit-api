# Issuers

## `GET /issuers`

Retrieves all available issuers.

### Expected request

```
GET /issuers HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK

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

## `GET /issuers/<slug>`

Retrieves a specific issuer.

### Expected request

```
GET /issuers/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK

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
  
  {
    "error": "not found"
  }
  ```

## `POST /issuers`

Creates a new issuer.

### Expected request

```
POST /issuers HTTP/1.1

{
  "name": "Issuer Name",
  "slug": "issuer-slug",
  "description": "Issuer Description"
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
    "error": "A issuer with that `slug` already exists",
    "received": {
      "name": "Issuer Name",
      "slug": "issuer-slug",
      "description": "Issuer Description"
    }
  }
  ```

## `PUT /issuers/<slug>`

Updates an existing issuer.

### Expected request

```
POST /issuers/<slug> HTTP/1.1

{
  "name": "New Issuer Name",
  "slug": "new-issuer-slug",
  "description": "New Issuer Description"
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
    "error": "A issuer with that `slug` already exists",
    "received": {
      "name": "Issuer Name",
      "slug": "issuer-slug",
      "description": "Issuer Description"
    }
  }
  ```

## `DELETE /issuers/<slug>`

Deletes an existing issuer.

### Expected request

```
DELETE /issuers/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK

{
  "status": "deleted"
}
```

### Potential errors

* **Issuer not found**

  ```
  HTTP/1.1 404 Not Found
  
  {
    "error": "not found"
  }
  ```
