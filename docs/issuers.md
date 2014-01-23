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

## `GET /issuers/<slug>`

Retrieves a specific issuer.

### Expected request

```
GET /issuers/<slug> HTTP/1.1
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
    "error": "not found"
  }
  ```

## `POST /issuers`

Creates a new issuer.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /issuers HTTP/1.1
Content-Type: application/json

{
  "name": "Issuer Name",
  "slug": "issuer-slug",
  "description": "Issuer Description"
}
```

```
POST /issuers HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Issuer%20Name&slug=issuer-slug&description=Issuer%20Description
```

```
POST /issuers HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

Issuer Name
--…
content-disposition: form-data; name="slug"

issuer-slug
--…
content-disposition: form-data; name="description"

Issuer Description
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
    "error": "An issuer with that `slug` already exists",
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

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /issuers/<slug> HTTP/1.1
Content-Type: application/json

{
  "name": "New Issuer Name",
  "slug": "new-issuer-slug",
  "description": "New Issuer Description"
}
```

```
PUT /issuers/<slug> HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=New%20Issuer%20Name&slug=new-issuer-slug&description=New%20Issuer%20Description
```

```
PUT /issuers/<slug> HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

New Issuer Name
--…
content-disposition: form-data; name="slug"

new-issuer-slug
--…
content-disposition: form-data; name="description"

New Issuer Description
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
    "error": "An issuer with that `slug` already exists",
    "received": {
      "name": "New Issuer Name",
      "slug": "new-issuer-slug",
      "description": "New Issuer Description"
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
Content-Type: application/json

{
  "status": "deleted"
}
```

### Potential errors

* **Issuer not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  
  {
    "error": "not found"
  }
  ```
