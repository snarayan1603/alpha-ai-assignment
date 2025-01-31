const axios = require("axios");
const logger = require("./logger");

const HF_MODEL_URL =
  "https://api-inference.huggingface.co/models/tiiuae/falcon-rw-1b";
const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

// Function to delay the execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filterSQLQuery = (responseText) => {
  // Use a regular expression to capture SQL-like text
  const sqlRegex = /SELECT[\s\S]+FROM[\s\S]+/i; // Matches SQL-like text starting with SELECT
  const match = responseText.match(sqlRegex);

  return match ? match[0] : "SQL query not found.";
};

const generateSQL = async (natural_query) => {
  try {
    const prompt = `You are an AI trained to generate SQL queries for DuckDB.  
Here is the natural language query: "${natural_query}".  
Please return the equivalent DuckDB SQL query.`;

    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
      },
    };

    let response;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      response = await axios.post(HF_MODEL_URL, payload, {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (
        response.data.error &&
        response.data.error.includes("currently loading")
      ) {
        const estimatedTime = response.data.estimated_time * 1000;
        logger.info(
          `Model is loading. Retrying in ${estimatedTime / 1000} seconds...`
        );
        attempts += 1;
        await delay(estimatedTime);
      } else {
        break;
      }
    }

    if (response.data.error) {
      logger.error(`Failed to generate SQL after ${attempts} attempts.`);
      throw new Error("Model failed to load or generate SQL");
    }

    console.log(response.data);
    const sqlQuery = filterSQLQuery(response.data[0].generated_text);
    console.log(sqlQuery);
    return sqlQuery;
  } catch (error) {
    console.log(error);
    logger.error(`AI generation error: ${error}`);
    throw new Error("Failed to generate SQL query");
  }
};

module.exports = { generateSQL };
