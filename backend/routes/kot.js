const express = require("express");
const router = express.Router();
const pool = require('../config/db');

// Create a new KOT
router.post("/", async (req, res) => {
  try {
    let { table_no, items, amount, kot_time } = req.body;

    // Validate table number
    table_no = parseInt(table_no, 10);
    if (isNaN(table_no)) {
      return res.status(400).json({ message: "Invalid or missing table_no" });
    }

    // Validate items
    let itemsJson = items;

    if (typeof itemsJson === "string") {
      try {
        itemsJson = JSON.parse(itemsJson);
      } catch (err) {
        return res.status(400).json({ message: "Invalid JSON format in items field" });
      }
    }

    if (!Array.isArray(itemsJson)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    // Other KOT info
    const table_type = "DINE IN";
    const kot_no = table_no;
    const time = kot_time ? kot_time.slice(11, 16) : "00:00";
    const biller = "biller"; // Replace with actual biller logic if needed

// Count items and total amount
const itemCount = itemsJson.reduce((sum, item) => sum + item.qty, 0);
const kotAmount = parseFloat(amount) || 0;

// Update the corresponding table with KOT status and details
await pool.query(
  "UPDATE tables SET status = 'kot', kot_time = $1, kot_amount = $2, kot_items_count = $3 WHERE id = $4",
  [time, kotAmount, itemCount, table_no]
);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating KOT:", err);
    res.status(500).json({ message: "Error creating KOT", error: err.message });
  }
});

// Get all KOTs (returns an array)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kots ORDER BY id DESC");
    res.json(result.rows); // Always returns an array
  } catch (err) {
    console.error("Error fetching KOTs:", err);
    res.status(500).json({ message: "Error fetching KOTs", error: err.message });
  }
});

module.exports = router;
