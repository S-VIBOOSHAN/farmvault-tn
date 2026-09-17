// db.js — lightweight file-based JSON "database".
// No native modules to compile, so it runs anywhere Node.js runs.
// Swap this module out for a real Postgres/MySQL/SQLite layer later
// without changing any route files, as long as you keep the same
// method names (getAll / getById / insert / update / remove).

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data", "db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error("db.json not found — run `node seed.js` first or check the data/ folder.");
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function nextId(collection) {
  return collection.length ? Math.max(...collection.map((r) => r.id)) + 1 : 1;
}

const collection = (name) => ({
  getAll: (filterFn) => {
    const db = readDb();
    const rows = db[name] || [];
    return filterFn ? rows.filter(filterFn) : rows;
  },
  getById: (id) => {
    const db = readDb();
    return (db[name] || []).find((r) => r.id === Number(id));
  },
  insert: (record) => {
    const db = readDb();
    if (!db[name]) db[name] = [];
    const row = { id: nextId(db[name]), createdAt: new Date().toISOString(), ...record };
    db[name].push(row);
    writeDb(db);
    return row;
  },
  update: (id, patch) => {
    const db = readDb();
    const rows = db[name] || [];
    const idx = rows.findIndex((r) => r.id === Number(id));
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    writeDb(db);
    return rows[idx];
  },
  remove: (id) => {
    const db = readDb();
    const rows = db[name] || [];
    const idx = rows.findIndex((r) => r.id === Number(id));
    if (idx === -1) return false;
    rows.splice(idx, 1);
    writeDb(db);
    return true;
  },
  raw: () => readDb()[name] || [],
});

module.exports = { collection, readDb, writeDb };
