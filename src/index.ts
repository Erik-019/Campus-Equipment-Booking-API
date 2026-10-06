import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

type BookingInput = {
  equipmentId: string;
  borrowerName: string;
  startAt: string;
  endAt: string;
  purpose: string;
};

type BookingRow = {
  id: string;
  equipment_id: string;
  borrower_name: string;
  start_at: string;
  end_at: string;
  purpose: string;
  created_at: string;
  updated_at: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

const errorResponse = (message: string, status: 400 | 404 | 409 | 500) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const toBooking = (row: BookingRow) => ({
  id: row.id,
  equipmentId: row.equipment_id,
  borrowerName: row.borrower_name,
  startAt: row.start_at,
  endAt: row.end_at,
  purpose: row.purpose,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const parseBookingInput = (body: unknown): BookingInput | string => {
  if (typeof body !== "object" || body === null) {
    return "Request body must be a JSON object";
  }

  const candidate = body as Record<string, unknown>;
  const fields = ["equipmentId", "borrowerName", "startAt", "endAt", "purpose"];
  const missing = fields.find((field) => !isNonEmptyString(candidate[field]));
  if (missing) {
    return `${missing} is required`;
  }

  const startMilliseconds = Date.parse(candidate.startAt as string);
  const endMilliseconds = Date.parse(candidate.endAt as string);
  if (Number.isNaN(startMilliseconds) || Number.isNaN(endMilliseconds)) {
    return "startAt and endAt must be valid ISO date-time strings";
  }
  if (startMilliseconds >= endMilliseconds) {
    return "startAt must be before endAt";
  }

  return {
    equipmentId: (candidate.equipmentId as string).trim(),
    borrowerName: (candidate.borrowerName as string).trim(),
    startAt: new Date(startMilliseconds).toISOString(),
    endAt: new Date(endMilliseconds).toISOString(),
    purpose: (candidate.purpose as string).trim(),
  };
};

const getBooking = async (db: D1Database, id: string) =>
  db
    .prepare(
      `SELECT id, equipment_id, borrower_name, start_at, end_at, purpose,
              created_at, updated_at
       FROM bookings WHERE id = ?`,
    )
    .bind(id)
    .first<BookingRow>();

const hasConflict = async (
  db: D1Database,
  input: BookingInput,
  excludedId?: string,
) => {
  const query = excludedId
    ? `SELECT id FROM bookings
       WHERE equipment_id = ?
         AND start_at < ?
         AND end_at > ?
         AND id != ?
       LIMIT 1`
    : `SELECT id FROM bookings
       WHERE equipment_id = ?
         AND start_at < ?
         AND end_at > ?
       LIMIT 1`;
  const statement = excludedId
    ? db.prepare(query).bind(input.equipmentId, input.endAt, input.startAt, excludedId)
    : db.prepare(query).bind(input.equipmentId, input.endAt, input.startAt);
  return Boolean(await statement.first<{ id: string }>());
};

app.get("/", (c) => c.json({ name: "Campus Equipment Booking API", status: "ok" }));

app.get("/equipment", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, name, location FROM equipment ORDER BY id",
  ).all();
  return c.json(result.results);
});

app.get("/bookings", async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT id, equipment_id, borrower_name, start_at, end_at, purpose,
            created_at, updated_at
     FROM bookings ORDER BY start_at`,
  ).all<BookingRow>();
  return c.json(result.results.map(toBooking));
});

app.get("/bookings/:id", async (c) => {
  const booking = await getBooking(c.env.DB, c.req.param("id"));
  if (!booking) return errorResponse("Booking not found", 404);
  return c.json(toBooking(booking));
});

app.post("/bookings", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = parseBookingInput(body);
  if (typeof parsed === "string") return errorResponse(parsed, 400);

  const equipment = await c.env.DB.prepare("SELECT id FROM equipment WHERE id = ?")
    .bind(parsed.equipmentId)
    .first<{ id: string }>();
  if (!equipment) return errorResponse("Equipment not found", 404);
  if (await hasConflict(c.env.DB, parsed)) {
    return errorResponse("Booking time conflicts with an existing booking", 409);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await c.env.DB.prepare(
    `INSERT INTO bookings
      (id, equipment_id, borrower_name, start_at, end_at, purpose, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, parsed.equipmentId, parsed.borrowerName, parsed.startAt, parsed.endAt, parsed.purpose, now, now)
    .run();

  const booking = await getBooking(c.env.DB, id);
  if (!booking) return errorResponse("Booking could not be created", 500);
  return c.json(toBooking(booking), 201);
});

app.patch("/bookings/:id", async (c) => {
  const id = c.req.param("id");
  if (!(await getBooking(c.env.DB, id))) return errorResponse("Booking not found", 404);

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = parseBookingInput(body);
  if (typeof parsed === "string") return errorResponse(parsed, 400);
  const equipment = await c.env.DB.prepare("SELECT id FROM equipment WHERE id = ?")
    .bind(parsed.equipmentId)
    .first<{ id: string }>();
  if (!equipment) return errorResponse("Equipment not found", 404);
  if (await hasConflict(c.env.DB, parsed, id)) {
    return errorResponse("Booking time conflicts with an existing booking", 409);
  }

  const now = new Date().toISOString();
  await c.env.DB.prepare(
    `UPDATE bookings
     SET equipment_id = ?, borrower_name = ?, start_at = ?, end_at = ?,
         purpose = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(parsed.equipmentId, parsed.borrowerName, parsed.startAt, parsed.endAt, parsed.purpose, now, id)
    .run();

  const booking = await getBooking(c.env.DB, id);
  if (!booking) return errorResponse("Booking could not be updated", 500);
  return c.json(toBooking(booking));
});

app.delete("/bookings/:id", async (c) => {
  const result = await c.env.DB.prepare("DELETE FROM bookings WHERE id = ?")
    .bind(c.req.param("id"))
    .run();
  if (!result.meta.changes) return errorResponse("Booking not found", 404);
  return new Response(null, { status: 204 });
});

app.onError((error, c) => {
  console.error(error);
  return errorResponse("Internal server error", 500);
});

export default app;
