const express = require("express");
const cors = require("cors");

const fieldsRouter = require("./routes/fields");
const fertilizerRouter = require("./routes/fertilizer");
const referenceRouter = require("./routes/reference");
const financeRouter = require("./routes/finance");
const assistantRouter = require("./routes/assistant");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple request log — helpful while developing
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    name: "FarmVault TN API",
    status: "ok",
    endpoints: [
      "GET/POST/PUT/DELETE /api/fields",
      "GET/POST/DELETE     /api/fertilizer/logs",
      "GET                 /api/fertilizer/rules",
      "GET                 /api/crops",
      "GET                 /api/crops/categories",
      "GET                 /api/pest",
      "GET                 /api/schemes",
      "GET                 /api/weather",
      "GET/POST/DELETE     /api/expenses",
      "GET/POST/DELETE     /api/harvests",
      "POST                /api/assistant"
    ]
  });
});

app.use("/api/fields", fieldsRouter);
app.use("/api/fertilizer", fertilizerRouter);
app.use("/api", referenceRouter); // /api/crops, /api/pest, /api/schemes, /api/weather
app.use("/api", financeRouter); // /api/expenses, /api/harvests
app.use("/api/assistant", assistantRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`FarmVault TN API running on http://localhost:${PORT}`);
});
