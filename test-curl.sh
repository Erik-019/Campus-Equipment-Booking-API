#!/bin/sh
set -eu

BASE_URL="${BASE_URL:-http://localhost:8787/api}"
BOOKING_JSON='{"equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T09:00:00.000Z","endAt":"2026-10-20T11:00:00.000Z","purpose":"Class presentation"}'

echo "1. List equipment (200)"
curl -sS -w '\nHTTP %{http_code}\n' "$BASE_URL/equipment"

echo "2. Create booking (201)"
created="$(curl -sS -w '\nHTTP %{http_code}' -X POST "$BASE_URL/bookings" \
  -H 'Content-Type: application/json' -d "$BOOKING_JSON")"
printf '%s\n' "$created"
booking_id="$(printf '%s\n' "$created" | sed -n '1s/.*"id":"\([^"]*\)".*/\1/p')"

echo "3. Read booking (200)"
curl -sS -w '\nHTTP %{http_code}\n' "$BASE_URL/bookings/$booking_id"

echo "4. Update booking (200)"
curl -sS -w '\nHTTP %{http_code}\n' -X PATCH "$BASE_URL/bookings/$booking_id" \
  -H 'Content-Type: application/json' \
  -d '{"equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T12:00:00.000Z","endAt":"2026-10-20T13:00:00.000Z","purpose":"Updated presentation"}'

echo "5. Invalid time (400)"
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$BASE_URL/bookings" \
  -H 'Content-Type: application/json' \
  -d '{"equipmentId":"eq-1","borrowerName":"Invalid User","startAt":"2026-10-20T15:00:00.000Z","endAt":"2026-10-20T14:00:00.000Z","purpose":"Invalid"}'

echo "6. Nonexistent equipment (404)"
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$BASE_URL/bookings" \
  -H 'Content-Type: application/json' \
  -d '{"equipmentId":"eq-404","borrowerName":"Unknown Equipment","startAt":"2026-10-21T09:00:00.000Z","endAt":"2026-10-21T10:00:00.000Z","purpose":"Not found"}'

echo "7. Conflicting booking (409)"
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$BASE_URL/bookings" \
  -H 'Content-Type: application/json' \
  -d '{"equipmentId":"eq-1","borrowerName":"Conflict User","startAt":"2026-10-20T12:30:00.000Z","endAt":"2026-10-20T13:30:00.000Z","purpose":"Conflict"}'

echo "8. Delete booking (204)"
curl -sS -i -X DELETE "$BASE_URL/bookings/$booking_id" | head -n 1
