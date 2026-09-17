const express = require("express");
const { collection } = require("../db");
const { FERT_RULES, PEST_DB } = require("../reference-data");

const router = express.Router();
const Fields = collection("fields");
const Harvests = collection("harvests");

// POST /api/assistant  { message, farmId }
// A deliberately simple, rule-based responder: it only ever answers from
// the farm's own stored records plus the static reference tables above —
// it never invents fertilizer doses, pest diagnoses, or scheme details.
// Swap the body of answerQuery() for a real LLM call (with these same
// records passed in as context) when you're ready to go beyond rules.
router.post("/", (req, res) => {
  const { message, farmId } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  const fields = Fields.getAll(farmId ? (f) => f.farmId === Number(farmId) : undefined);
  const harvests = Harvests.getAll(farmId ? (h) => h.farmId === Number(farmId) : undefined);

  res.json({ reply: answerQuery(message, fields, harvests) });
});

function answerQuery(message, fields, harvests) {
  const t = message.toLowerCase();
  const totalAcres = fields.reduce((s, f) => s + parseFloat(f.area || 0), 0);

  if (t.includes("acre") || t.includes("ஏக்கர்") || t.includes("total") || t.includes("area")) {
    return `Your farm has ${totalAcres.toFixed(2)} acres across ${fields.length} field(s): ${fields
      .map((f) => `${f.code} (${f.area} ac)`)
      .join(", ")}.`;
  }

  const fieldMatch = fields.find((f) => t.includes(f.code.toLowerCase()));
  if (fieldMatch && (t.includes("crop") || t.includes("பயிர்"))) {
    return `Field ${fieldMatch.code} currently has ${fieldMatch.crop || "no crop set"} on ${fieldMatch.area} acres (${fieldMatch.soil}, ${fieldMatch.irrigation} irrigation).${
      fieldMatch.notes ? " Note: " + fieldMatch.notes : ""
    }`;
  }

  if (t.includes("fertilizer") || t.includes("உரம்")) {
    const cropKey = Object.keys(FERT_RULES).find((c) => t.includes(c.toLowerCase()));
    if (cropKey) {
      const stages = FERT_RULES[cropKey];
      return (
        `Fertilizer guidance for ${cropKey}:\n` +
        Object.entries(stages)
          .map(([s, r]) => `• ${s}: ${r}`)
          .join("\n")
      );
    }
    return "Tell me which crop — e.g. 'fertilizer for paddy' or 'fertilizer for groundnut'.";
  }

  if (t.includes("pest") || t.includes("disease") || t.includes("பூச்சி")) {
    const cropKey = Object.keys(PEST_DB).find((c) => t.includes(c.toLowerCase()));
    if (cropKey) {
      return PEST_DB[cropKey].map((p) => `${p.pest} (${p.stage}): ${p.symptom}. Management: ${p.mgmt}`).join("\n");
    }
    return "Which crop's pest info do you need? e.g. 'pest in cotton'.";
  }

  if (t.includes("last year") || t.includes("history") || t.includes("கடந்த வருடம்")) {
    if (harvests.length === 0) return "No harvest history recorded yet.";
    const h = harvests.slice().sort((a, b) => b.year - a.year)[0];
    return `Your most recent harvest record: ${h.fieldCode} grew ${h.crop} in ${h.year}, yielding ${h.yieldKg} kg at a cost of ₹${h.cost.toLocaleString("en-IN")}.`;
  }

  if (t.includes("weather") || t.includes("rain") || t.includes("மழை")) {
    return "Check GET /api/weather for the current sample forecast — connect a real weather API for live data.";
  }

  if (t.includes("scheme") || t.includes("subsidy") || t.includes("government") || t.includes("திட்டம்")) {
    return "See GET /api/schemes for a reference list (PM-KISAN, PMFBY, etc.) — always verify current details on the official portal.";
  }

  return "I can answer about your fields, acreage, crop history, fertilizer guidance, and pest info. Try: 'What crop is in F-01?' or 'Fertilizer for paddy?'";
}

module.exports = router;
