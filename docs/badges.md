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
Content-Type: application/json

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
Content-Type: application/json

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
  Content-Type: application/json
  
  {
    "error": "not found"
  }
  ```

## `POST /badges`

Creates a new badge.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /badges HTTP/1.1
Content-Type: application/json

{
  "name": "Badge Name",
  "slug": "badge-slug",
  "strapline": "Badge Strapline",
  "description": "Badge Description",
  "image": "http://example.org/image.png"
}
```

```
POST /badges HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Badge%20Name&slug=badge-slug&strapline=Badge%20Strapline&description=Badge%20Description&image=http%3A%2F%2Fexample.org%2Fimage.png
```

```
POST /badges HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

Badge Name
--…
content-disposition: form-data; name="slug"

badge-slug
--…
content-disposition: form-data; name="strapline"

Badge Strapline
--…
content-disposition: form-data; name="description"

Badge Description
--…
content-disposition: form-data; name="image"

http://example.org/image.png
--…--
```

#### Alternatively…

Images can be uploaded and hosted by the issuer API.

```
POST /badges HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
…
--…
content-disposition: form-data; name="image"; filename="…"
Content-Type: image/png
Content-Transfer-Encoding: binary

…
--…--
```

*Currently unsupported, but being considered.*

```
POST /badges HTTP/1.1
Content-Type: application/json

{
  …,
  "image": "data:image/png;base64,…"
}
```

```
POST /badges HTTP/1.1
Content-Type: application/x-www-form-urlencoded

…&image=data%3Aimage%2Fpng%3Bbase64%2C…
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
    "error": "A badge with that `slug` already exists",
    "received": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "description": "Badge Description",
      "image": "http://example.org/image.png"
    }
  }
  ```

## `PUT /badges/<slug>`

Updates an existing badge.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /badges/<slug> HTTP/1.1
Content-Type: application/json

{
  "name": "New Badge Name",
  "slug": "new-badge-slug",
  "strapline": "New Badge Strapline",
  "description": "New Badge Description",
  "image": "http://example.org/new-image.png"
}
```

```
PUT /badges HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=New%20Badge%20Name&new-slug=badge-slug&strapline=New%20Badge%20Strapline&description=New%20Badge%20Description&image=http%3A%2F%2Fexample.org%2Fnew-image.png
```

```
PUT /badges HTTP/1.1
Content-Type: multipart/form-data; boundary=…

--…
content-disposition: form-data; name="name"

New Badge Name
--…
content-disposition: form-data; name="slug"

new-badge-slug
--…
content-disposition: form-data; name="strapline"

New Badge Strapline
--…
content-disposition: form-data; name="description"

New Badge Description
--…
content-disposition: form-data; name="image"

http://example.org/new-image.png
--…--
```

#### Alternatively…

Images may be uploaded in the same manner as creating a new badge.

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
    "error": "A badge with that `slug` already exists",
    "received": {
      "name": "New Badge Name",
      "slug": "new-badge-slug",
      "strapline": "New Badge Strapline",
      "description": "New Badge Description",
      "image": "http://example.org/new-image.png"
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
Content-Type: application/json

{
  "status": "deleted"
}
```

### Potential errors

* **Badge not found**

  ```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  
  {
    "error": "not found"
  }
  ```
