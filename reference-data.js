// reference-data.js
// Static agricultural reference data used by the API.
// IMPORTANT: fertilizer doses, pest guidance, and scheme details here are
// illustrative sample data for a demo/prototype. Before using this in
// production, replace these values with verified data sourced from TNAU
// (Tamil Nadu Agricultural University) crop production guides, the Tamil
// Nadu Agriculture Department, and official scheme portals (PM-KISAN,
// PMFBY, etc.) — never let an AI layer invent doses or subsidy figures.

const CROPS = [
  { cat: "Food Grains & Millets", en: "Paddy", ta: "நெல்", season: "Kuruvai/Samba", duration: "105-135 days" },
  { cat: "Food Grains & Millets", en: "Maize", ta: "மக்காச்சோளம்", season: "Kharif/Rabi", duration: "90-110 days" },
  { cat: "Food Grains & Millets", en: "Sorghum (Cholam)", ta: "சோளம்", season: "Rainfed", duration: "100-120 days" },
  { cat: "Food Grains & Millets", en: "Finger Millet (Ragi)", ta: "கேழ்வரகு", season: "Rainfed", duration: "110-130 days" },
  { cat: "Food Grains & Millets", en: "Pearl Millet (Cumbu)", ta: "கம்பு", season: "Kharif", duration: "75-90 days" },
  { cat: "Food Grains & Millets", en: "Little Millet (Samai)", ta: "சாமை", season: "Rainfed", duration: "90-100 days" },
  { cat: "Pulses", en: "Blackgram", ta: "உளுந்து", season: "Post-monsoon", duration: "70-90 days" },
  { cat: "Pulses", en: "Greengram", ta: "பாசிப்பயறு", season: "Summer/Kharif", duration: "65-75 days" },
  { cat: "Pulses", en: "Redgram (Tur)", ta: "துவரை", season: "Kharif", duration: "150-180 days" },
  { cat: "Pulses", en: "Bengal Gram", ta: "கொண்டைக்கடலை", season: "Rabi", duration: "90-110 days" },
  { cat: "Oilseeds", en: "Groundnut", ta: "நிலக்கடலை", season: "Kharif/Rabi", duration: "100-120 days" },
  { cat: "Oilseeds", en: "Gingelly (Sesame)", ta: "எள்", season: "Summer", duration: "75-90 days" },
  { cat: "Oilseeds", en: "Sunflower", ta: "சூரியகாந்தி", season: "All seasons", duration: "90-100 days" },
  { cat: "Oilseeds", en: "Castor", ta: "ஆமணக்கு", season: "Rainfed", duration: "150-180 days" },
  { cat: "Commercial & Fibre", en: "Sugarcane", ta: "கரும்பு", season: "Year-round planting", duration: "11-12 months" },
  { cat: "Commercial & Fibre", en: "Cotton", ta: "பருத்தி", season: "Kharif", duration: "150-180 days" },
  { cat: "Commercial & Fibre", en: "Tobacco", ta: "புகையிலை", season: "Rabi", duration: "120-150 days" },
  { cat: "Vegetables", en: "Tomato", ta: "தக்காளி", season: "All seasons", duration: "90-120 days" },
  { cat: "Vegetables", en: "Brinjal", ta: "கத்தரிக்காய்", season: "All seasons", duration: "120-150 days" },
  { cat: "Vegetables", en: "Okra (Ladies Finger)", ta: "வெண்டைக்காய்", season: "All seasons", duration: "50-65 days" },
  { cat: "Vegetables", en: "Onion", ta: "வெங்காயம்", season: "Rabi", duration: "100-120 days" },
  { cat: "Vegetables", en: "Chilli", ta: "மிளகாய்", season: "Kharif/Rabi", duration: "150-180 days" },
  { cat: "Fruits", en: "Banana", ta: "வாழை", season: "Year-round planting", duration: "11-13 months" },
  { cat: "Fruits", en: "Mango", ta: "மாம்பழம்", season: "Perennial", duration: "3-5 yrs to bear" },
  { cat: "Fruits", en: "Guava", ta: "கொய்யா", season: "Perennial", duration: "2-3 yrs to bear" },
  { cat: "Fruits", en: "Papaya", ta: "பப்பாளி", season: "Year-round", duration: "9-11 months" },
  { cat: "Plantation", en: "Coconut", ta: "தென்னை", season: "Perennial", duration: "5-6 yrs to bear" },
  { cat: "Plantation", en: "Arecanut", ta: "பாக்கு", season: "Perennial", duration: "5-7 yrs to bear" },
  { cat: "Spices & Condiments", en: "Turmeric", ta: "மஞ்சள்", season: "Kharif", duration: "7-9 months" },
  { cat: "Spices & Condiments", en: "Coriander", ta: "கொத்தமல்லி", season: "Rabi/Summer", duration: "90-100 days" },
  { cat: "Flowers", en: "Jasmine", ta: "மல்லிகை", season: "Perennial", duration: "Year-round bloom" },
  { cat: "Flowers", en: "Marigold", ta: "சாமந்தி", season: "All seasons", duration: "75-90 days" },
  { cat: "Medicinal & Aromatic", en: "Aloe Vera", ta: "கற்றாழை", season: "Perennial", duration: "8-10 months" },
  { cat: "Regional/Speciality", en: "Betel Vine", ta: "வெற்றிலை", season: "Perennial", duration: "Continuous harvest" }
];

const FERT_RULES = {
  Paddy: {
    Nursery: "Basal: FYM + DAP as per soil test.",
    "Vegetative/Tillering": "N split dose (Urea) + full P + half K.",
    Flowering: "Remaining K + micronutrient spray if deficiency symptoms seen.",
    "Harvest prep": "Stop N application 3 weeks before harvest."
  },
  Groundnut: {
    Nursery: "Gypsum + basal P at sowing.",
    "Vegetative/Tillering": "Light N top-dress if leaves pale.",
    Flowering: "Gypsum top-dress at pegging stage.",
    "Harvest prep": "Avoid excess N late season — reduces pod fill."
  },
  Sugarcane: {
    Nursery: "Basal N-P-K as per soil test at planting.",
    "Vegetative/Tillering": "First N top-dress at tillering.",
    Flowering: "Second/third N split + K before grand growth.",
    "Harvest prep": "Stop N 6-8 weeks before harvest."
  },
  Cotton: {
    Nursery: "Basal P + K at sowing.",
    "Vegetative/Tillering": "First N split at squaring.",
    Flowering: "Second N split + K at flowering/boll formation.",
    "Harvest prep": "Foliar micronutrients if boll shedding observed."
  },
  Maize: {
    Nursery: "Basal N-P-K at sowing.",
    "Vegetative/Tillering": "N top-dress at knee-high stage.",
    Flowering: "N top-dress at tasseling.",
    "Harvest prep": "No further fertilizer needed."
  }
};

const PEST_DB = {
  Paddy: [
    { stage: "Vegetative", pest: "Stem borer", symptom: "Dead heart in young shoots", mgmt: "Field monitoring, pheromone traps, balanced N use." },
    { stage: "Tillering", pest: "Brown Plant Hopper", symptom: "Yellowing, hopper burn patches", mgmt: "Avoid excess N, maintain field drainage, monitor base of plant." }
  ],
  Groundnut: [
    { stage: "Vegetative", pest: "Leaf miner", symptom: "Mining trails on leaves", mgmt: "Monitor regularly, avoid water stress." },
    { stage: "Flowering", pest: "Tikka leaf spot", symptom: "Circular brown spots on leaves", mgmt: "Field sanitation, monitor humidity periods." }
  ],
  Cotton: [
    { stage: "Vegetative", pest: "Aphids", symptom: "Curling of young leaves", mgmt: "Monitor undersides of leaves, avoid excess N." },
    { stage: "Flowering", pest: "Bollworm", symptom: "Holes in bolls/squares", mgmt: "Pheromone traps, regular scouting." }
  ],
  Sugarcane: [
    { stage: "Vegetative", pest: "Early shoot borer", symptom: "Dead heart, central shoot withers", mgmt: "Field monitoring, remove affected shoots." }
  ],
  Maize: [
    { stage: "Vegetative", pest: "Fall armyworm", symptom: "Window-pane feeding on leaves, whorl damage", mgmt: "Early monitoring of whorls, field sanitation." }
  ]
};

const GOVT_SCHEMES = [
  { name: "PM-KISAN", desc: "Central income support scheme for landholding farmer families.", tag: "Central" },
  { name: "PMFBY (Crop Insurance)", desc: "Covers crop loss from drought, flood, cyclone, pest & disease events.", tag: "Central" },
  { name: "TN state farmer welfare / input assistance schemes", desc: "State-level programmes — check the current official notification for details.", tag: "State" },
  { name: "Soil Health Card Scheme", desc: "Soil testing and nutrient recommendation support.", tag: "Central" },
  { name: "Micro Irrigation Subsidy (Drip/Sprinkler)", desc: "Subsidy support for water-saving irrigation equipment.", tag: "State/Central" }
];

module.exports = { CROPS, FERT_RULES, PEST_DB, GOVT_SCHEMES };
