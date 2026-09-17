const express = require("express");
const { collection } = require("../db");

const router = express.Router();
const Fields = collection("fields");

// GET /api/fields  -> list all fields (optionally ?farmId=1)
router.get("/", (req, res) => {
  const { farmId } = req.query;
  const rows = Fields.getAll(farmId ? (f) => f.farmId === Number(farmId) : undefined);
  res.json(rows);
});

// GET /api/fields/:id
router.get("/:id", (req, res) => {
  const row = Fields.getById(req.params.id);
  if (!row) return res.status(404).json({ error: "Field not found" });
  res.json(row);
});

// POST /api/fields  { farmId, code, area, soil, irrigation, crop, notes }
router.post("/", (req, res) => {
  const { farmId, code, area, soil, irrigation, crop, notes } = req.body || {};
  if (!code || !area) {
    return res.status(400).json({ error: "code and area are required" });
  }
  const row = Fields.insert({
    farmId: farmId || 1,
    code,
    area: Number(area),
    soil: soil || "",
    irrigation: irrigation || "",
    crop: crop || "",
    notes: notes || ""
  });
  res.status(201).json(row);
});

// PUT /api/fields/:id  (partial update)
router.put("/:id", (req, res) => {
  const row = Fields.update(req.params.id, req.body || {});
  if (!row) return res.status(404).json({ error: "Field not found" });
  res.json(row);
});

// DELETE /api/fields/:id
router.delete("/:id", (req, res) => {
  const ok = Fields.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Field not found" });
  res.status(204).end();
});

module.exports = router;
