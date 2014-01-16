* Containers
  * Systems
    * `GET /systems`
    * `POST /systems`
    * `GET /systems/<id>`
    * `PUT /systems/<id>`
    * `DELETE /systems/<id>`
  * Issuers
    * `GET /issuers`
    * `POST /issuers`
    * `GET /issuers/<id>`
    * `PUT /issuers/<id>`
    * `DELETE /issuers/<id>`
  * Programs
    * `GET /programs`
    * `POST /programs`
    * `GET /programs/<id>`
    * `PUT /programs/<id>`
    * `DELETE /programs/<id>`
* Badges
  * Managing
    * `GET /badges`
    * `POST /badges`
    * `GET /badges/<id>`
    * `PUT /badges/<id>`
    * `POST /badges/<id>/archive`
    * `DELETE /badges/<id>`
  * Assessment
    * `GET /badges/<id>/applications`
    * `POST /badges/<id>/applications`
    * `GET /badges/<id>/applications/<id>/evidence`
    * `POST /badges/<id>/applications/<id>/evidence`
    * `GET /badges/<id>/applications/<id>/evidence/<id>`
    * `DELETE /badges/<id>/applications/<id>/evidence/<id>`
    * `POST /badges/<id>/applications/<id>/comment`
    * `POST /badges/<id>/applications/<id>/approve`
    * `POST /badges/<id>/applications/<id>/deny`
  * Claim Codes
    * `GET /badges/<id>/codes`
    * `POST /badges/<id>/codes`
    * `POST /badges/<id>/codes/random`
    * `GET /codes/<id>`
    * `DELETE /codes/<id>`
    * `POST /codes/<id>/claim`
    * `POST /codes/<id>/unclaim`
  * Issuing
    * `GET /badges/<id>/awards`
    * `POST /badges/<id>/awards`
    * `DELETE /badges/<id>/awards/<id>`
