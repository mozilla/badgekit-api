# Data Model

This is a high level overview of the data model we expect from the API, it is written pre-implementation and meant as a guide more than end user / integrator documentation.

### Object Definitions

_System_ - a collection of issuers under a common brand. Owner of a badge issuing website. "Chicago Summer of Learning" is an example.

_Issuer_ - an organization the issues a badge. Although they have their own website and resources, their BadgeKit association is through a _system_.

_Program_ - a logical collection of badges under an issuer, associated with a program available from an _issuer_. Example - "Rahm's Readers" through the issuer "Chicago Public Library".

_Badge_ / _Badge Class_- a badge definition, different from a _badge instance_. A _badge_ can be marked as a draft, or as a template.

### Object Hierarchy / Rules

* An instance of BadgeKit has many _systems_. A _system_ has many _issuers_.
* An _issuer_ has a single _system_.
* An _issuer_ has many _programs_.
* A _program_ has a single _issuer_.
* A _program_ has many _badge classes_.
* A _badge class_ has a single program.
* A _badge class_ spawns _badge instances_ but there isn't a relationship between the _badge instance_ and the _badge class_.
* The _badge instance_ tracks the url of the criteria page of the _badge class_ but doesn't have a database relationship with its _badge class_.
* A _badge class_ might be spawned from a _badge class_ that's marked as a "template". In this case, the _badge class_ has a relationship with the _badge class_ it was spawned from.
* A _badge class_ marked as a "template" or as a "draft" cannot create _badge instances_.

### Hierarchy Picture

<pre>

                          System
                            +
                            |
                            |
         +----------+       |       +----------+
         |  Issuer  |<------+------>|  Issuer  |
         +----+-----+               +-------+--+
              |                             |
              +-----------+                 |
              v           v                 v
      +---------+    +---------+           +---------+
      | Program |    | Program |           | Program |
      +-----+---+    +---------+           +-+-------+
            v                                v
    +-------------+                         +-------------+
    | Badge Class |                         | Badge Class |
    +-------------+                         +----------- -+
</pre>

[edit on ASCIIFLOW](http://www.asciiflow.com/#Draw8409620631556097120/422863549)

### Templates

Templates allow systems and issuers to share badge classes, without tightly coupling systems to one another. Allowing a system to copy a series of badges via templates, makes the badges unique between the systems. A system / issuer can modify the badges to suit their needs without affecting the original creator of the template.