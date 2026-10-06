1. List equipment (200)
[{"id":"eq-1","name":"Projector A","location":"Building 1"},{"id":"eq-2","name":"Camera Kit B","location":"Media Lab"}]
HTTP 200
2. Create booking (201)
{"id":"797d28e5-51ad-4e68-b15f-9db9fed5a82c","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T09:00:00.000Z","endAt":"2026-10-20T11:00:00.000Z","purpose":"Class presentation","createdAt":"2026-10-06T07:48:18.272Z","updatedAt":"2026-10-06T07:48:18.272Z"}
HTTP 201
3. Read booking (200)
{"id":"797d28e5-51ad-4e68-b15f-9db9fed5a82c","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T09:00:00.000Z","endAt":"2026-10-20T11:00:00.000Z","purpose":"Class presentation","createdAt":"2026-10-06T07:48:18.272Z","updatedAt":"2026-10-06T07:48:18.272Z"}
HTTP 200
4. Update booking (200)
{"id":"797d28e5-51ad-4e68-b15f-9db9fed5a82c","equipmentId":"eq-1","borrowerName":"Somchai Jaidee","startAt":"2026-10-20T12:00:00.000Z","endAt":"2026-10-20T13:00:00.000Z","purpose":"Updated presentation","createdAt":"2026-10-06T07:48:18.272Z","updatedAt":"2026-10-06T07:48:18.785Z"}
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
8. Missing booking (404)
{"error":"Booking not found"}
HTTP 404
9. Delete booking (204)
HTTP/2 204 
