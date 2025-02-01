const { exec } = require("child_process");

async function queryOllama(query) {
  return new Promise((resolve, reject) => {
    const escapedQuery = query.replaceAll(/[()]/g, "\\$&"); // Escape all parentheses

    const command = `echo "${escapedQuery}" | ollama run mistral`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Execution Error:", error.message);
        reject(new Error(`Execution Error: ${error.message}`));
        return;
      }

      if (stderr) {
        // Log stderr as a warning instead of treating it as a critical error
        console.warn("Ollama Warning:", stderr.trim());

        // Optionally, if certain keywords indicate critical errors, you can handle them:
        if (stderr.toLowerCase().includes("error")) {
          reject(new Error(`Ollama Critical Error: ${stderr.trim()}`));
          return;
        }
      }

      resolve(stdout.trim());
    });
  });
}

async function generateSQLQuery(naturalLanguageQuery) {
  return new Promise((resolve, reject) => {
    const escapedQuery = naturalLanguageQuery.replaceAll(/[()]/g, "\\$&"); // Escape all parentheses

    // Command to send the query to Ollama with the Mistral model
    const command = `echo ${escapedQuery} | ollama run mistral`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Execution Error:", error.message);
        reject(new Error(`Execution Error: ${error.message}`));
        return;
      }

      if (stderr) {
        // Log stderr as a warning instead of treating it as a critical error
        console.warn("Ollama Warning:", stderr.trim());

        // Optionally, if certain keywords indicate critical errors, you can handle them:
        if (stderr.toLowerCase().includes("error")) {
          reject(new Error(`Ollama Critical Error: ${stderr.trim()}`));
          return;
        }
      }

      resolve(stdout.trim());
    });
  });
}

module.exports = { queryOllama, generateSQLQuery };
