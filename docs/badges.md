# Badges

## `GET /badges`

Retrieves all available badges

### Expected request

```
GET /badges HTTP/1.1
```

#### Available request parameters

* **`archived`:** `[true|false|any]`  
  Whether to include archived badges.
  * `true` will return only archived badges
  * `false` (default) will return only unarchived badges
  * `any` will return badges regardless of archived status

### Expected response

```
HTTP/1.1 200 OK

{
  "badges": [
    {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "description": "Badge Description",
      "imageURL": "http://example.org/badge.png",
      "archived": false
    },
    ...
  ]
}
```

### Potential errors

*None*

## `GET /badges/<slug>`

Retrieves a specific badge.

### Expected request

```
GET /badges/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK

{
  "badge": {
    "name": "Badge Name",
    "slug": "badge-slug",
    "strapline": "Badge Strapline",
    "description": "Badge Description",
    "imageURL": "http://example.org/badge.png",
    "archived": false
  }
}
```

### Potential errors

* **Badge not found**

  ```
  HTTP/1.1 404 Not Found
  
  {
    "error": "not found"
  }
  ```

## `POST /badges`

Creates a new badge.

### Expected request

```
POST /badges HTTP/1.1

{
  "name": "Badge Name",
  "slug": "badge-slug",
  "strapline": "Badge Strapline",
  "description": "Badge Description"
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
    "error": "A badge with that `slug` already exists",
    "received": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "description": "Badge Description"
    }
  }
  ```

## `PUT /badges/<slug>`

Updates an existing badge.

### Expected request

```
PUT /badges/<slug> HTTP/1.1

{
  "name": "New Badge Name",
  "slug": "new-badge-slug",
  "strapline": "New Badge Strapline",
  "description": "New Badge Description"
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
    "error": "A badge with that `slug` already exists",
    "received": {
      "name": "New Badge Name",
      "slug": "new-badge-slug",
      "description": "New Badge Description"
    }
  }
  ```

## `DELETE /badges/<slug>`

Deletes an existing badge.

### Expected request

```
DELETE /badges/<slug> HTTP/1.1
```

### Expected response

```
HTTP/1.1 200 OK

{
  "status": "deleted"
}
```

### Potential errors

* **Badge not found**

  ```
  HTTP/1.1 404 Not Found
  
  {
    "error": "not found"
  }
  ```
