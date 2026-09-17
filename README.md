# FarmVault TN — Backend API

A small Express.js REST API that backs the FarmVault TN farm-management app.
Data is stored in a JSON file (`data/db.json`) — no database server to
install, so it runs anywhere Node.js runs. Swap `db.js` for a real
Postgres/MySQL layer later without touching the route files.

## Run locally

```bash
npm install
npm start
```

The API starts on `http://localhost:3000` (set `PORT` env var to change it).
Visit `http://localhost:3000/` for a list of all endpoints.

## Endpoints

| Method | Path                          | Purpose                                  |
|--------|-------------------------------|-------------------------------------------|
| GET    | `/api/fields`                 | List fields (`?farmId=`)                  |
| POST   | `/api/fields`                 | Add a field                               |
| PUT    | `/api/fields/:id`              | Update a field                            |
| DELETE | `/api/fields/:id`              | Remove a field                            |
| GET    | `/api/fertilizer/rules`        | Fertilizer recommendation table (`?crop=&stage=`) |
| GET    | `/api/fertilizer/logs`         | Usage history (`?fieldCode=`)             |
| POST   | `/api/fertilizer/logs`         | Log a fertilizer application              |
| GET    | `/api/crops`                   | Crop catalogue (`?category=&q=`)          |
| GET    | `/api/crops/categories`        | List crop categories                      |
| GET    | `/api/pest`                    | Pest/disease info (`?crop=`)              |
| GET    | `/api/schemes`                 | Government scheme reference list          |
| GET    | `/api/weather`                 | Sample weather + forecast (`?lat=&lon=`)  |
| GET    | `/api/expenses`                | Expense entries + totals (`?farmId=`)     |
| POST   | `/api/expenses`                | Add an expense/income entry               |
| GET    | `/api/harvests`                | Harvest/yield history (`?fieldCode=`)     |
| POST   | `/api/harvests`                | Add a harvest record                      |
| POST   | `/api/assistant`               | Rule-based Q&A over your own farm data (`{ "message": "..." }`) |

All list endpoints return JSON arrays; all POST/PUT bodies are JSON.

## Connecting the frontend

The `farmvault-tn.html` / `index.html` app currently stores everything in
the browser's `localStorage`. To wire it to this backend, replace its
`loadState()` / `saveState()` calls with `fetch()` calls to these
endpoints (e.g. `fetch('/api/fields')` instead of reading from
`localStorage`). Because the JSON shapes are close to what the frontend
already uses, this is mostly a search-and-replace job in the `<script>`
section — ask me to do this wiring for you if you'd like the fully
connected version.

## Deploying for free

Any Node.js host works. Two easy options:

**Render.com**
1. Push this folder to a GitHub repo.
2. On Render: New → Web Service → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Render gives you a public HTTPS URL.

**Railway.app**
1. Push to GitHub, then "New Project → Deploy from GitHub repo" on Railway.
2. It auto-detects Node.js and runs `npm start`.

⚠️ The JSON-file database (`data/db.json`) resets on most free hosts
whenever the app redeploys or restarts, since the filesystem isn't
persistent. That's fine for a demo. For real production use, swap in a
managed database (e.g. Postgres on Render/Railway/Supabase) — `db.js` is
the only file you'd need to rewrite; every route file calls it through
the same five methods (`getAll`, `getById`, `insert`, `update`, `remove`).

## Important note on the reference data

Fertilizer doses, pest guidance, and government scheme details in
`reference-data.js` are **illustrative sample data** for this prototype.
Before real farmers rely on this app, replace them with verified figures
from TNAU (Tamil Nadu Agricultural University) crop guides, the Tamil
Nadu Agriculture Department, and official scheme portals — and keep the
`/api/assistant` responses sourced from that same verified data rather
than letting any AI layer invent doses or subsidy amounts.
