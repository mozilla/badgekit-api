# Issuing

Issuing is the process of awarding a badge to a specific earner. In BadgeKit API, issuing a badge means creating a badge instance. __Note that when a review is submitted in which an earner application for a badge is approved, this does not mean that the badge is automatically issued. Issuer sites must use the below API endpoints to issue badges, marking any relevant applications as processed when this occurs. These endpoints also apply to badges issued without the assessment process, for example badges issued directly to earner email addresses or using claim codes.__

## Endpoints

* [Retrieve Badge Instances](#retrieve-badge-instances)
 * `GET /systems/:slug/badges/:slug/instances`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/instances`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances`
* [Retrieve a Specific Instance](#retrieve-a-specific-instance)
 * `GET /systems/:slug/instances/:email`
 * `GET /systems/:slug/issuers/:slug/instances/:email`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/instances/:email`
 * `GET /systems/:slug/badges/:slug/instances/:email`
 * `GET /systems/:slug/issuers/:slug/badges/:slug/instances/:email`
 * `GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances/:email`
* [Create a Badge Instance](#create-a-badge-instance)
 * `POST /systems/:slug/badges/:slug/instances`
 * `POST /systems/:slug/issuers/:slug/badges/:slug/instances`
 * `POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances`
* [Delete an Instance](#delete-an-instance)
 * `DELETE /systems/:slug/badges/:slug/instances/:email`
 * `DELETE /systems/:slug/issuers/:slug/badges/:slug/instances/:email`
 * `DELETE /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances/:email`

## Retrieve Badge Instances

Retrieves all instances for a specific badge within a [system](systems.md), [issuer](issuers.md) or [program](programs.md).

### Expected request

```
GET /systems/:slug/badges/:slug/instances
GET /systems/:slug/issuers/:slug/badges/:slug/instances
GET /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances
```

### Expected response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json

```

## Retrieve a Specific Instance

## Create a Badge Instance

To actually issue (or "award") a badge to an earner in BadgeKit API, you create a badge instance. A badge instance is an awarded badge, issued to a specific earner.

### Expected request

```
POST /systems/:slug/badges/:slug/instances
POST /systems/:slug/issuers/:slug/badges/:slug/instances
POST /systems/:slug/issuers/:slug/programs/:slug/badges/:slug/instances
```

Requests can be sent as `application/json`, `application/x-www-form-urlencoded` or `multipart/form-data`.

| Parameters             | Required        | Description              |
|:-----------------------|-----------------|--------------------------|
| **email** | required | The email address for the earner the badge is being issued to. |
| **claimCode** | optional | A claim code for the badge. |
| **slug** | optional | Instance slug. |
| **issuedOn** | optional | Date issued. |
| **expires** | optional | Date instance expires. |

<!--expected response, errors-->

## Delete an Instance

<!--* **GET** /public/assertions/:slug-->
