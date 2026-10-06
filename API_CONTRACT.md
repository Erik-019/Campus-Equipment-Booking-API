# API Contract

Base URL: `http://localhost:8787/api`

## Equipment

`GET /equipment` returns `200` and the seeded equipment records:

```json
[
  { "id": "eq-1", "name": "Projector A", "location": "Building 1" },
  { "id": "eq-2", "name": "Camera Kit B", "location": "Media Lab" }
]
```

## Bookings

| Method | Path | Success |
| --- | --- | --- |
| GET | `/bookings` | 200 |
| GET | `/bookings/:id` | 200 |
| POST | `/bookings` | 201 |
| PATCH | `/bookings/:id` | 200 |
| DELETE | `/bookings/:id` | 204 |

POST and PATCH require `equipmentId`, `borrowerName`, `startAt`, `endAt`, and `purpose`.
Times must be ISO date-time strings, and `startAt` must be before `endAt`.
Adjacent bookings are allowed; overlapping bookings for the same equipment are rejected.

Errors always use `{ "error": "message" }`:

- `400`: malformed, missing, or invalid request data.
- `404`: booking or equipment does not exist.
- `409`: the time range conflicts with another booking for the same equipment.

All SQL values from requests use D1 parameter binding.
