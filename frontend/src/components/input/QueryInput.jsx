import React, { useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

const QueryInput = ({ sampleQueries, setQuery, schema, dbName }) => {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle list item click
  const handleItemClick = (item) => {
    setNaturalQuery(item);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!naturalQuery) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4500/api/convertToQuery",
        { naturalQuery, schema, dbName }
      );
      setQuery(response.data.sqlQuery);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(loading);

  return (
    <Box
      sx={{
        mx: "auto",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your naturalQuery"
          value={naturalQuery}
          onChange={(e) => setNaturalQuery(e.target.value)}
          sx={{ marginRight: 2 }} // Add margin to the right of TextField to space it from the button
        />

        <IconButton
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          aria-label="submit query"
          sx={{
            height: "100%", // Ensure the button height is the same as the TextField
            width: "auto", // Let the button width adjust automatically
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>

      <List
        sx={{
          border: "1px solid #ddd",
          borderRadius: 1,
          mb: 2,
          height: 200,
          overflow: "auto",
        }}
      >
        {sampleQueries.map((item, index) => (
          <ListItem button key={index} onClick={() => handleItemClick(item)}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default QueryInput;
