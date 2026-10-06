# Schema / ERD

```text
equipment
---------
id          TEXT PRIMARY KEY
name        TEXT NOT NULL
location    TEXT NOT NULL
      1
      |
      | equipment_id (foreign key)
      |
      many
bookings
--------
id              TEXT PRIMARY KEY
equipment_id    TEXT NOT NULL
borrower_name   TEXT NOT NULL
start_at        TEXT NOT NULL  -- UTC ISO-8601
end_at          TEXT NOT NULL  -- UTC ISO-8601
purpose         TEXT NOT NULL
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

Each booking belongs to one equipment record. An equipment record can have many
bookings. The application checks that `start_at < end_at` and rejects a booking
when another booking for the same equipment satisfies:

```text
existing.start_at < requested.end_at
AND existing.end_at > requested.start_at
```

The update check excludes the booking being updated.
