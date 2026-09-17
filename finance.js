const express = require("express");
const { collection } = require("../db");

const router = express.Router();
const Expenses = collection("expenses");
const Harvests = collection("harvests");

/* ---------------- Expenses ---------------- */

// GET /api/expenses?farmId=1
router.get("/expenses", (req, res) => {
  const { farmId } = req.query;
  const rows = Expenses.getAll(farmId ? (e) => e.farmId === Number(farmId) : undefined);
  const income = rows.filter((e) => e.type.includes("Income")).reduce((s, e) => s + e.amount, 0);
  const cost = rows.filter((e) => !e.type.includes("Income")).reduce((s, e) => s + e.amount, 0);
  res.json({ entries: rows, totals: { income, cost, net: income - cost } });
});

// POST /api/expenses  { farmId, fieldCode, type, amount, date }
router.post("/expenses", (req, res) => {
  const { farmId, fieldCode, type, amount, date } = req.body || {};
  if (!type || !amount) return res.status(400).json({ error: "type and amount are required" });
  const row = Expenses.insert({
    farmId: farmId || 1,
    fieldCode: fieldCode || null,
    type,
    amount: Number(amount),
    date: date || new Date().toISOString().slice(0, 10)
  });
  res.status(201).json(row);
});

router.delete("/expenses/:id", (req, res) => {
  const ok = Expenses.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Expense not found" });
  res.status(204).end();
});

/* ---------------- Harvests / yield history ---------------- */

// GET /api/harvests?fieldCode=F-01
router.get("/harvests", (req, res) => {
  const { fieldCode, farmId } = req.query;
  let rows = Harvests.getAll();
  if (fieldCode) rows = rows.filter((h) => h.fieldCode === fieldCode);
  if (farmId) rows = rows.filter((h) => h.farmId === Number(farmId));
  res.json(rows.sort((a, b) => a.year - b.year));
});

// POST /api/harvests  { farmId, fieldCode, year, crop, yieldKg, cost }
router.post("/harvests", (req, res) => {
  const { farmId, fieldCode, year, crop, yieldKg, cost } = req.body || {};
  if (!fieldCode || !crop || !year) {
    return res.status(400).json({ error: "fieldCode, crop and year are required" });
  }
  const row = Harvests.insert({
    farmId: farmId || 1,
    fieldCode,
    year: Number(year),
    crop,
    yieldKg: Number(yieldKg) || 0,
    cost: Number(cost) || 0
  });
  res.status(201).json(row);
});

router.delete("/harvests/:id", (req, res) => {
  const ok = Harvests.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Harvest record not found" });
  res.status(204).end();
});

module.exports = router;
