# Middleware Layer API

A small Express and PostgreSQL REST API for managing student biodata.

## Requirements

- Node.js 20 or newer
- PostgreSQL

## Setup

```sh
npm install
cp .env.example .env
```

Set the PostgreSQL values in `.env`, then create the table with the SQL in
[`db/schema.sql`](db/schema.sql). Start the API with `npm start`; during
development use `npm run dev`.

The example config uses the standard `PGHOST`, `PGPORT`, `PGDATABASE`,
`PGUSER`, and `PGPASSWORD` variables. You can also provide `DATABASE_URL`.

The API listens on port `3001` by default. `GET /health` reports whether the
database is reachable. Biodata CRUD endpoints are documented below.

## API

All responses use `{ "success", "message", "data", "error" }` fields.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List biodata (kept for compatibility) |
| GET | `/biodata` | List biodata |
| POST | `/biodata` | Create a record |
| PUT | `/biodata/:id` | Replace a record's editable fields |
| DELETE | `/biodata/:id` | Delete a record |
| GET | `/health` | Check API and database availability |

Create and update requests accept JSON with `nama`, `nim`, and `kelas` strings.
Validation errors return HTTP 400; missing records return HTTP 404.
