const express = require("express");
const { collection } = require("../db");
const { FERT_RULES } = require("../reference-data");

const router = express.Router();
const FertLogs = collection("fertilizerLogs");

// GET /api/fertilizer/rules  -> full recommendation table
// GET /api/fertilizer/rules?crop=Paddy&stage=Flowering -> one recommendation
router.get("/rules", (req, res) => {
  const { crop, stage } = req.query;
  if (crop && stage) {
    const rec = FERT_RULES[crop] && FERT_RULES[crop][stage];
    return res.json({ crop, stage, recommendation: rec || null });
  }
  if (crop) return res.json({ crop, stages: FERT_RULES[crop] || null });
  res.json(FERT_RULES);
});

// GET /api/fertilizer/logs?fieldCode=F-01
router.get("/logs", (req, res) => {
  const { fieldCode } = req.query;
  const rows = FertLogs.getAll(fieldCode ? (l) => l.fieldCode === fieldCode : undefined);
  res.json(rows);
});

// POST /api/fertilizer/logs  { fieldCode, name, qty, date }
router.post("/logs", (req, res) => {
  const { fieldCode, name, qty, date } = req.body || {};
  if (!fieldCode || !name || !qty) {
    return res.status(400).json({ error: "fieldCode, name and qty are required" });
  }
  const row = FertLogs.insert({
    fieldCode,
    name,
    qty: Number(qty),
    date: date || new Date().toISOString().slice(0, 10)
  });
  res.status(201).json(row);
});

// DELETE /api/fertilizer/logs/:id
router.delete("/logs/:id", (req, res) => {
  const ok = FertLogs.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Log not found" });
  res.status(204).end();
});

module.exports = router;
