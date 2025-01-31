const duckdb = require("duckdb");
const fs = require("fs");
const path = require("path");
const fastcsv = require("fast-csv");

const dbFile = "my_database.db"; // DuckDB will create this file if it doesn't exist
const csvFilePath = path.resolve(__dirname, "./million_records.csv");

// Initialize DuckDB (In-memory database)
const db = new duckdb.Database(dbFile);

// // Function to set up the database schema
// const setupDB = () => {
//   const sql = `
//         CREATE TABLE customers (
//             id INTEGER PRIMARY KEY,
//             name TEXT,
//             revenue FLOAT
//         );
//         INSERT INTO customers VALUES
//             (1, 'Alice', 5000),
//             (2, 'Bob', 7000),
//             (3, 'Charlie', 6500);
//     `;
//   db.run(sql);

//   db.run(`
//         CREATE TABLE IF NOT EXISTS customer_data (
//           name TEXT,
//           age INTEGER,
//           city TEXT,
//           income DOUBLE
//         )
//       `);
// };

// Initialize DB setup
// setupDB();

// Export the database instance for reuse
module.exports = db;
