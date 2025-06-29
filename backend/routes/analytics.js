// routes/analytics.js
const express = require("express");
const fetch = require("node-fetch"); // or native fetch in Node 18+
const router = express.Router();

// GBIF categories
const speciesCategories = [
  { name: "Birds", taxonKey: 212 },
  { name: "Mammals", taxonKey: 359 },
  { name: "Reptiles", taxonKey: 358 },
  { name: "Amphibians", taxonKey: 131 },
  { name: "Fish", taxonKey: 777 },
  { name: "Insects", taxonKey: 216 },
];

// GET /api/gbif-counts
router.get("/gbif-counts", async (req, res) => {
  try {
    const counts = [];

    for (const category of speciesCategories) {
      const response = await fetch(
        `https://api.gbif.org/v1/species/count?rank=SPECIES&classKey=${category.taxonKey}`
      );
      const data = await response.json();
      counts.push({ category: category.name, count: data.count });
    }

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GBIF data" });
  }
});

// GET /api/conservation-status
router.get("/conservation-status", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.inaturalist.org/v1/taxa?rank=species&per_page=100&taxon_id=3"
    );
    const data = await response.json();

    const statusCounts = {};

    for (const taxon of data.results) {
      const rawStatus = taxon.conservation_status?.status_name || "Unknown";
      const status = formatStatus(rawStatus);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    res.json(statusCounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch iNaturalist data" });
  }
});

function formatStatus(status) {
  const lower = status.toLowerCase();
  if (lower.includes("least")) return "Least Concern";
  if (lower.includes("near")) return "Near Threatened";
  if (lower.includes("vulnerable")) return "Vulnerable";
  if (lower.includes("critically")) return "Critically Endangered";
  if (lower.includes("endangered")) return "Endangered";
  return "Unknown";
}

module.exports = router;
