# Campus Equipment Booking API

## Setup

1. Install dependencies: `npm install`
2. Create a Cloudflare D1 database:

   ```sh
   npx wrangler d1 create campus-bookings
   ```

3. Put the returned `database_id` into `wrangler.toml`.
4. Apply the migration locally:

   ```sh
   npx wrangler d1 migrations apply campus-bookings --local
   ```

5. Start the API:

   ```sh
   npm run dev
   ```

The local base URL is `http://localhost:8787/api`.

## API

See [API_CONTRACT.md](./API_CONTRACT.md) for endpoints and examples.
See [SCHEMA.md](./SCHEMA.md) for the relationship and overlap rule.
See [QUALITY_GATE_REVIEW.md](./QUALITY_GATE_REVIEW.md) for the review findings
and final submission decision.
See [curl_test_guide.md](./curl_test_guide.md) for the instructor-provided
manual test sequence.

## Curl evidence

Start the local server, then run:

```sh
sh test-curl.sh | tee TEST_EVIDENCE.md
```

The script covers successful CRUD operations and `400`, `404`, and `409`
responses. The resulting `TEST_EVIDENCE.md` is the evidence to submit.

## Production migration and deployment

```sh
npx wrangler d1 migrations apply campus-bookings --remote
npm run deploy
```
