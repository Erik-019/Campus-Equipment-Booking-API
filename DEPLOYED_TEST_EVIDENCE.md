1. List equipment (200)
[{"id":"eq-1","name":"Projector A","location":"Building 1"},{"id":"eq-2","name":"Camera Kit B","location":"Media Lab"}]
HTTP 200
2. Create booking (201)
{"id":"e18e39f0-0731-4fa9-af2c-67649860b126","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T09:00:00.000Z","endAt":"2026-10-20T11:00:00.000Z","purpose":"Class presentation","createdAt":"2026-10-06T06:56:35.559Z","updatedAt":"2026-10-06T06:56:35.559Z"}
HTTP 201
3. Read booking (200)
{"id":"e18e39f0-0731-4fa9-af2c-67649860b126","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T09:00:00.000Z","endAt":"2026-10-20T11:00:00.000Z","purpose":"Class presentation","createdAt":"2026-10-06T06:56:35.559Z","updatedAt":"2026-10-06T06:56:35.559Z"}
HTTP 200
4. Update booking (200)
{"id":"e18e39f0-0731-4fa9-af2c-67649860b126","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T12:00:00.000Z","endAt":"2026-10-20T13:00:00.000Z","purpose":"Updated presentation","createdAt":"2026-10-06T06:56:35.559Z","updatedAt":"2026-10-06T06:56:36.284Z"}
HTTP 200
5. Invalid time (400)
{"error":"startAt must be before endAt"}
HTTP 400
6. Nonexistent equipment (404)
{"error":"Equipment not found"}
HTTP 404
7. Conflicting booking (409)
{"error":"Booking time conflicts with an existing booking"}
HTTP 409
8. Delete booking (204)
HTTP/2 204 
