// src/index.js
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const logger = require("./utils/logger.js");
const queryRouter = require("./routes/queryRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/query", queryRouter);

const PORT = 4500;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
