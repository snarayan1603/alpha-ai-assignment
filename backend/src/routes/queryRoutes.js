const express = require("express");
const { generateSQL } = require("../utils/aiService");
const db = require("../config/db");

const router = express.Router();

// API Route: Convert Text to SQL & Execute
router.get("/", async (req, res) => {
  try {
    const { natural_query, useAi } = req.query;
    if (!natural_query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    let sqlQuery = natural_query;
    if (useAi === true || useAi === "true") {
      // Generate SQL from Hugging Face model
      sqlQuery = await generateSQL(natural_query);
    }

    console.log("Executing SQL query:", sqlQuery);
    // Execute SQL on DuckDB
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Convert BigInt to String (or Number)
      const convertedRows = rows.map((row) => {
        const convertedRow = {};

        for (const key in row) {
          // Use typeof to check if it's a BigInt
          if (typeof row[key] === "bigint") {
            // Convert BigInt to string (or number if needed)
            convertedRow[key] = row[key].toString();
          } else {
            convertedRow[key] = row[key];
          }
        }
        return convertedRow;
      });

      res.json({ sql: sqlQuery, result: convertedRows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
