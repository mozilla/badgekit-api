# Authorization

## Overview

Authorization is done by generating a JWT token for each request and putting it in the HTTP `Authorization` header with the auth-scheme `JWT`, under the auth-param `token`. Example (line breaks are for display purposes only):

```
Authorization: JWT token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiO\
  iJtYXN0ZXIiLCJleHAiOjEzOTM0MzYwMjksIm1ldGhvZCI6IlBPU1QiLCJwYXRoIjoiL3N\
  5c3RlbXMiLCJib2R5Ijp7ImFsZyI6IlNIQTI1NiIsImhhc2giOiI1MzAxYTc1YmJiNjZkM\
  DIzNWRmY2MyZWJiNDc3OGQ2ZGFjM2Q3NzE2N2ZjZDdhOWNkODgzNzI5Njk4ZGI3NmY1In1\
  9.wqBuduhIjkGle_XdfQE5VqygueuxDqxQdm2Y98Ij7UA"
```

## JWT

### Header

Use the `HS256` (HMAC-SHA256) algorithm. Example header:
```json
{"typ":"JWT",
 "alg":"HS256"}
```
### Claims

* **key**: Use `"master"` for now. **TODO**: update this when we implement specific consumer keys
* **exp**: (Optional) [Unix time](http://en.wikipedia.org/wiki/Unix_time) for when this token should expire. A short value should be used, e.g. 30-60 seconds from the time of token generation. *This is optional because of potential clock synchronization problems that can occur between servers, but it's highly recommended.*
* **method**: HTTP Method being used in this request. Should be `GET`, `POST`, `PUT`, or `DELETE`.
* **path**: Relative HTTP path being requested, e.g. `/systems/chicago` or `/systems/chicago/badges?archived=true`. Note that any query variables should be represented in the path.
* **body**: (Required on `POST`, `PUT`) An object with two fields:
  * **hash**: A hash of the entire contents of the body of the POST request, e.g. `sha256('{"slug":"hi","name":"Hello"}')`
  * **alg**: Just use `sha256`.

### Secret

Ask one of us for the secret.

### Example in JavaScript
```js
var jws = require('jws')
var crypto = require('crypto')
var body = '{"slug": "some-system", "name": "Some System", "url":"http://example.org"}'
var computedHash = crypto.createHash('SHA256').update(body).digest('hex')
var token = jws.sign({
  secret: "supersecret",
  header: {typ: "JWT", alg:"HS256"},
  payload: {
    key: "master",
    exp: 1393436029,
    method: "POST",
    path: "/systems",
    body: {
      alg: "sha256",
      hash: computedHash
    }
  },
})
```

## Purpose of Each Claim

* **key**: To look up the secret used to sign the token.
* **exp**: General protection against replay attacks: a short lived token has limited opportunity for re-use.
* **method**: Protection from replay attacks against the same URL with a different method, e.g., converting a POST request into a DELETE request.
* **path**: Protection from replay attacks with the same method but against a new URL, e.g, using the same token for a POST to `/systems/chicago` as the token for a POST to `/systems/new-york`.
* **body**: Protection from data tampering; ensures the data that the client intended to send is the data received.
