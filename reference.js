const express = require("express");
const { CROPS, PEST_DB, GOVT_SCHEMES } = require("../reference-data");

const router = express.Router();

// GET /api/crops?category=Vegetables&q=paddy
router.get("/crops", (req, res) => {
  const { category, q } = req.query;
  let rows = CROPS;
  if (category) rows = rows.filter((c) => c.cat.toLowerCase() === category.toLowerCase());
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((c) => c.en.toLowerCase().includes(needle) || c.ta.includes(q));
  }
  res.json(rows);
});

// GET /api/crops/categories
router.get("/crops/categories", (req, res) => {
  res.json([...new Set(CROPS.map((c) => c.cat))]);
});

// GET /api/pest?crop=Paddy
router.get("/pest", (req, res) => {
  const { crop } = req.query;
  if (crop) return res.json(PEST_DB[crop] || []);
  res.json(PEST_DB);
});

// GET /api/schemes
router.get("/schemes", (req, res) => {
  res.json(GOVT_SCHEMES);
});

// GET /api/weather?lat=..&lon=..
// Demo stub — swap the inside of this handler for a real call to a
// weather provider (e.g. Open-Meteo, IMD) keyed by the farm's coordinates.
router.get("/weather", (req, res) => {
  res.json({
    source: "demo-sample-data",
    location: req.query.lat && req.query.lon ? { lat: req.query.lat, lon: req.query.lon } : "Attur, Salem",
    current: { tempC: 31, humidity: 68, rainChancePct: 40, windKph: 11 },
    forecast: [
      { day: "Today", icon: "sun", tempC: 32 },
      { day: "Tomorrow", icon: "cloud", tempC: 30 },
      { day: "Day 3", icon: "rain", tempC: 27 },
      { day: "Day 4", icon: "showers", tempC: 28 },
      { day: "Day 5", icon: "sun", tempC: 31 }
    ],
    advisory: "Moderate rain expected later this week. Review drainage in low-lying fields and postpone fertilizer application if heavy rain is forecast."
  });
});

module.exports = router;
