# NOSTR Meetup Communities
Meetup events on Nostr using Sveltekit and [NDK](https://github.com/nostr-dev-kit/ndk)

Users can create Communities, similar to how you would on meetup dot com, and then attach [NIP-52 Time based Calendar events to them](https://github.com/nostr-protocol/nips/blob/master/52.md)

**31925** Calendar events have some additional fields to those mentioned in the NIP, [see below](#31923---time-based-calendar-event). 

**Communities use 3 _currently unofficial_ Nostr kinds:**

### 1037 - Meetup community creation event:

This event acts as an anchor point for other event kinds associated with the community

```json
{
  "content": <Optional description>,
  "created_at": <Unix timestamp in seconds>,
  "id": <32-bytes lowercase hex-encoded SHA-256 of the the serialized event data>,
  "kind": 1037,
  "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>
}
```

### 30037 - Meetup community metadata:

```json
{
  "content": <description of community, markdown formatted>,
  "created_at": <Unix timestamp in seconds>,
  "id": <32-bytes lowercase hex-encoded SHA-256 of the the serialized event data>,
  "kind": 30037,
  "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>,
  "tags": [
    [
      "title", <Community name>
    ],
    [
      "d", <Unique identifier>
    ],
    [
      "e",<id of the associated 1037 event>
    ],
    [
      "image", <optional image URL>
    ],
    [
      "g", <geohash>, "geohash"
    ],
    [
      "g", <Alpha2 Country Code:City Name>, "city" // eg "GB:Brighton"
    ],
    [
      "t", <string> // can be multiple t tags
    ]
  ]
}

```

### 10037 - Meetup community follow list:

A list e tags representing the ids of any communities the user has followed.

Users can also add some additional tags in here so that they will show up in location based searches

```json
{
  "content": <User status>,
  "created_at": <Unix timestamp in seconds>,
  "id": <32-bytes lowercase hex-encoded SHA-256 of the the serialized event data>,
  "kind": 10037,
  "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>,
  "tags": [
    [
      "e", <id of an associated 1037 event>
    ],
    [
      "e", <another id of an associated 1037 event>
    ],
    // etc...
    [
      "locationStatus", <living | visiting>
    ],
    [
      "g", <Alpha2:City>, "city" // eg "GB:Brighton"
    ],
    [
      "t", <topic 1>
    ],
    [
      "t", <topic 2>
    ]
    // etc...
  ]
}
```

### 31923 - Time-Based Calendar Event:

In addition to the fields mentioned in NIP-52 there is also the following:

- and additional "g" tag formatted as the city g tags above. ie. Alpha2:City Name. This makes it possible to search by city. I made the decision to use this format in lieu of a formal decision being made on correct formatting or geotags (see [here](https://github.com/nostr-protocol/nips/pull/763))
- an ["L" , "kind"] and ["l", "meetup", "kind"] tag so that these evnts can be differentiated from those that don'e have a community associated with them
- an "e" tag referencing the associated community.
- an optional "brief" tag, for a short description of the event

This gives us:

```json
{
  "content": <markdown formatted event description>,
  "created_at": <Unix timestamp in seconds>,
  "id": <32-bytes lowercase hex-encoded SHA-256 of the the serialized event data>,
  "kind": 31923,
  "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>,
  "tags": [
    ["d", <UUID>],

    ["name", <name of calendar event>],

    // Dates
    ["start", <Unix timestamp in seconds>],
    ["end", <Unix timestamp in seconds>],

    // Location
    ["location", "<location>"],
    ["g", <geohash>, "geohash"],
    ["g", <Alpha2:City>, "city"],

    // Hashtags
    ["t", "<tag>"],
    ["t", "<tag>"],
    
    // addition fields
    ["brief", <brief description>],
    ["e", <id of the associated 1037 event>],
    ["L", "kind" ],
    ["l", "meetup", "kind"],
    
  ]
}
```

### 31925 - Calendar Event RSVP:

See the [offical NIP](https://github.com/nostr-protocol/nips/blob/master/52.md)