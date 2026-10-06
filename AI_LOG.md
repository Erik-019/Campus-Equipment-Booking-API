# AI Log

This document records AI assistance used during the practical test. I reviewed and
verified all generated code before using it.

| Prompt / assistance | Used | My verification |
| --- | --- | --- |
| Asked for a D1-backed Hono CRUD API for equipment bookings | Route structure, D1 queries, and validation patterns | Checked every endpoint against the contract and reviewed parameter binding |
| Asked for an overlap query | `start_at < requestedEnd AND end_at > requestedStart` | Verified create and update behavior, including excluding the current booking on update |

I can explain the schema, status-code decisions, validation, and overlap logic independently.
