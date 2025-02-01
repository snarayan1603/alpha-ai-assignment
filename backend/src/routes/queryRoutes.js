const express = require("express");
const {
  generateSQL,
  queryOllama,
  generateSQLQuery,
} = require("../utils/aiService");
const db = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

function extractNumberedQueries(text) {
  // Regular expression to match lines starting with a number followed by a period
  const regex = /(\d+\.\s*"(.*?)")/gs;

  const queries = [];
  let match;

  // Loop through all matches and extract the query
  while ((match = regex.exec(text)) !== null) {
    const cleanedQuery = match[2].trim(); // match[2] contains the text inside the quotes
    queries.push(cleanedQuery);
  }

  return queries;
}

function extractSQLQueries(text) {
  const regex = /```sql([\s\S]*?)```/g; // Match all SQL code blocks
  const matches = [...text.matchAll(regex)]; // Extract all matches

  if (matches.length > 0) {
    // Clean each matched SQL query by trimming and removing \n
    return matches.map((match) => match[1].replace(/\n/g, " ").trim());
  } else {
    return []; // Return an empty array if no SQL queries are found
  }
}

// API Route: Convert Text to SQL & Execute
router.get("/query", async (req, res) => {
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

router.get("/defaultData", async (req, res) => {
  const dbName = req.query.dbName;

  if (!dbName) {
    return res.status(400).json({ error: "Missing dbName query parameter" });
  }

  try {
    // Fetch table schema using DuckDB (Fixing the variable scope issue)
    db.all(`PRAGMA table_info(${dbName});`, async (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching schema", details: err.message });
      }

      let query = `Give me 5 sample queries for ${dbName} in natural language that will be used to generate sql query, but you don't show query. 
      these are my table columns:`;

      rows.forEach((row) => {
        query += `row name: ${row.name}, row type: ${row.type} `;
      });

      // AI-generated sample queries for Text-to-SQL (customize as needed)
      const aiText = await queryOllama(query);

      const sampleQueries = extractNumberedQueries(aiText);

      res.json({
        message: `Example queries for ${dbName}`,
        queries: sampleQueries,
        schema: rows, // Corrected variable name
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching schema", details: error.message });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    const originalFileName = req.file.originalname;
    const fileNameWithoutExt = path.parse(originalFileName).name;

    let query = "";

    // Handle CSV files
    if (fileExt === ".csv") {
      query = `CREATE TABLE ${fileNameWithoutExt} AS SELECT * FROM read_csv_auto('${filePath}')`;
    }
    // Handle JSON files
    else if (fileExt === ".json") {
      query = `CREATE TABLE ${fileNameWithoutExt} AS SELECT * FROM read_json_auto('${filePath}')`;
    }
    // Handle Parquet files
    else if (fileExt === ".parquet") {
      query = `CREATE TABLE ${fileNameWithoutExt} AS SELECT * FROM read_parquet('${filePath}')`;
    }
    // Handle DuckDB or DB files (attach the file to an existing database)
    else if (fileExt === ".db" || fileExt === ".duckdb") {
      // Assuming you're attaching the DuckDB file
      query = `ATTACH DATABASE '${filePath}' AS ${fileNameWithoutExt}`;
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    db.run(query, (err) => {
      fs.unlinkSync(filePath); // Delete file after processing
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "File processed and inserted into DuckDB",
        dbName: fileNameWithoutExt,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
});
router.post("/convertToQuery", async (req, res) => {
  const { naturalQuery, schema, dbName } = req.body;
  if (!naturalQuery) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  let promt = `Convert this to SQL Query: ${naturalQuery} from ${dbName} and ${dbName} is the table name and here are the table columns: `;
  schema.forEach((column) => {
    promt += `${column.name} of type ${column.type}, cid ${column.cid} , notnull ${column.notnull} `;
  });

  try {
    const sqlQuery = await generateSQLQuery(promt);
    const finalQuery = extractSQLQueries(sqlQuery);
    res.json({ naturalQuery, sqlQuery: finalQuery?.[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/download-csv", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Execute the query
    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "No data found for the query" });
      }

      // Convert the result to CSV
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(rows);

      // Create a file name based on the query or timestamp
      const fileName = `result-${Date.now()}.csv`;
      const filePath = path.join(__dirname, `../../uploads/${fileName}`);

      // Write CSV to a file
      fs.writeFileSync(filePath, csv);

      // Send CSV file to client for download
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          return res.status(500).json({ error: "Failed to download file" });
        }

        // Optionally, delete the file after download to save space
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

module.exports = router;
