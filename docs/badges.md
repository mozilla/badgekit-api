# Badges

## `Badge List`

Retrieves all available badges, filtered by system, issuer or program.

### Expected request

```
GET /systems/:systemSlug/badges HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/badges HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges HTTP/1.1
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
      "earnerDescription": "Badge Description",
      "consumerDescription": "Badge Description for Consumers",
      "issuerUrl": "http://example.org/issuer",
      "rubricUrl": "http://example.org/rubric",
      "criteriaUrl": "http://example.org/criteria",
      "timeValue": 10,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "imageUrl": "http://example.org/badge.png",
      "archived": false
    },
    ...
  ]
}
```

### Potential errors

*None*

## `Retrieve a specific badge`

Retrieves a specific badge.

### Expected request

```
GET /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
GET /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug HTTP/1.1
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
    "earnerDescription": "Badge Description",
    "consumerDescription": "Badge Description for Consumers",
    "issuerUrl": "http://example.org/issuer",
    "rubricUrl": "http://example.org/rubric",
    "criteriaUrl": "http://example.org/criteria",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "imageUrl": "http://example.org/badge.png",
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
    "code": "ResourceNotFound",
    "message": "Could not find badge with slug `<attempted slug>`"
  }
  ```

## `Create a badge`

Creates a new badge, or updates an existing badge.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
POST /systems/:systemSlug/badges HTTP/1.1
POST /systems/:systemSlug/issuers/:issuerSlug/badges HTTP/1.1
POST /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges
```

```
HTTP/1.1

Content-Type: application/json

{
  "name": "Badge Name",
  "slug": "badge-slug",
  "strapline": "Badge Strapline",
  "earnerDescription": "Badge Description",
  "consumerDescription": "Badge Description for Consumers",
  "issuerUrl": "http://example.org/issuer",
  "rubricUrl": "http://example.org/rubric",
  "criteriaUrl": "http://example.org/criteria",
  "timeValue": 10,
  "timeUnits": "minutes",
  "limit": 5,
  "unique": false,
  "imageUrl": "http://example.org/image.png",
  "archived": false
}
```

```
Content-Type: application/x-www-form-urlencoded

name=Badge%20Name&slug=badge-slug&strapline=Badge%20Strapline&description=Badge%20Description&imageUrl=http%3A%2F%2Fexample.org%2Fimage.png
```

```
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
content-disposition: form-data; name="imageUrl"

http://example.org/image.png
--…--
```

#### Alternatively…

Images can be uploaded and hosted by the issuer API.

```
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

```
Content-Type: application/x-www-form-urlencoded

…&image=data%3Aimage%2Fpng%3Bbase64%2C…
```

### Expected response

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "created",
  "badge": {
    "name": "Badge Name",
    "slug": "badge-slug",
    "strapline": "Badge Strapline",
    "earnerDescription": "Badge Description",
    "consumerDescription": "Badge Description for Consumers",
    "issuerUrl": "http://example.org/issuer",
    "rubricUrl": "http://example.org/rubric",
    "criteriaUrl": "http://example.org/criteria",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "imageUrl": "http://example.org/badge.png",
    "archived": false
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
    "error": "badge with that `slug` already exists",
    "details": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "earnerDescription": "Badge Description",
      "consumerDescription": "Badge Description for Consumers",
      "issuerUrl": "http://example.org/issuer",
      "rubricUrl": "http://example.org/rubric",
      "criteriaUrl": "http://example.org/criteria",
      "timeValue": 10,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "imageUrl": "http://example.org/badge.png",
      "archived": false
    }
  }
  ```

## `PUT /badges/<slug>`

Updates an existing badge.

### Expected request

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

```
PUT /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
PUT /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
PUT /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug
```


```
Content-Type: application/json

{
  "name": "Badge Name",
  "slug": "badge-slug",
  "strapline": "Badge Strapline",
  "earnerDescription": "Badge Description",
  "consumerDescription": "Badge Description for Consumers",
  "issuerUrl": "http://example.org/issuer",
  "rubricUrl": "http://example.org/rubric",
  "criteriaUrl": "http://example.org/criteria",
  "timeValue": 10,
  "timeUnits": "minutes",
  "limit": 5,
  "unique": false,
  "imageUrl": "http://example.org/badge.png",
  "archived": false
}
```

```
Content-Type: application/x-www-form-urlencoded

name=New%20Badge%20Name&new-slug=badge-slug&strapline=New%20Badge%20Strapline&description=New%20Badge%20Description&image=http%3A%2F%2Fexample.org%2Fnew-image.png
```

```
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
  "status": "updated",
  "badge": {
    "name": "Badge Name",
    "slug": "badge-slug",
    "strapline": "Badge Strapline",
    "earnerDescription": "Badge Description",
    "consumerDescription": "Badge Description for Consumers",
    "issuerUrl": "http://example.org/issuer",
    "rubricUrl": "http://example.org/rubric",
    "criteriaUrl": "http://example.org/criteria",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "imageUrl": "http://example.org/badge.png",
    "archived": false
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
    "error": "badge with that `slug` already exists",
    "details": {
      "name": "Badge Name",
      "slug": "badge-slug",
      "strapline": "Badge Strapline",
      "earnerDescription": "Badge Description",
      "consumerDescription": "Badge Description for Consumers",
      "issuerUrl": "http://example.org/issuer",
      "rubricUrl": "http://example.org/rubric",
      "criteriaUrl": "http://example.org/criteria",
      "timeValue": 10,
      "timeUnits": "minutes",
      "limit": 5,
      "unique": false,
      "imageUrl": "http://example.org/badge.png",
      "archived": false
    }
  }
  ```

## Delete a Badge

Deletes an existing badge.

### Expected request

```
DELETE /systems/:systemSlug/badges/:badgeSlug HTTP/1.1
DELETE /systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug HTTP/1.1
DELETE /systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "deleted",
  "badge": {
    "name": "Badge Name",
    "slug": "badge-slug",
    "strapline": "Badge Strapline",
    "earnerDescription": "Badge Description",
    "consumerDescription": "Badge Description for Consumers",
    "issuerUrl": "http://example.org/issuer",
    "rubricUrl": "http://example.org/rubric",
    "criteriaUrl": "http://example.org/criteria",
    "timeValue": 10,
    "timeUnits": "minutes",
    "limit": 5,
    "unique": false,
    "imageUrl": "http://example.org/badge.png",
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
    "code": "ResourceNotFound",
    "message": "Could not find badge with slug `<attempted slug>`"
  }
  ```
