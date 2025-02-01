import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const QueryForm = ({ setTableData, query, setQuery, dbName }) => {
  // States for managing query input, loading, and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle submit button click
  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // API call to the '/query' endpoint to fetch query data
      const response = await axios.get(
        `http://localhost:4500/api/query?natural_query=${query}&useAI=${false}&dbName=${dbName}`
      );

      // Assuming response.data contains the data we want to store
      setTableData(response.data.result); // Store the data in parent state
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enter your query:
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit(query)}
          fullWidth
          disabled={loading}
          style={{ width: "200px" }}
          endIcon={loading && <CircularProgress size={24} />}
        >
          Submit Query
        </Button>
      </Box>

      {/* TextArea for query input */}
      <TextField
        variant="outlined"
        multiline
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        placeholder="Type your query here..."
        style={{ marginBottom: "20px" }}
      />
      {/* Error Message */}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default QueryForm;
