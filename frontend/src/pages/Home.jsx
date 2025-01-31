import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

const Home = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localQueries = JSON.parse(localStorage.getItem("localQueries")) || [];
    setQueries(localQueries);
  }, []);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      saveToLocalStorage(query);
      const response = await axios.get(
        `http://localhost:4500/api/query?useAi=${false}&natural_query=${query}`
      );
      setResult(response.data.result);
      setError(null);
    } catch (err) {
      setError(
        err.response ? err.response.data.error : "Error executing query"
      );
      setResult(null);
    }
    setLoading(false);
  };

  function saveToLocalStorage(data) {
    const localQueries = JSON.parse(localStorage.getItem("localQueries")) || [];
    localQueries.unshift(data);
    setQueries([...new Set(localQueries)]);
  }

  // Handle delete query
  const deleteQuery = (index) => {
    const updatedQueries = queries.filter((_, idx) => idx !== index);
    setQueries(updatedQueries);
  };

  useEffect(() => {
    if (queries.length > 0) {
      localStorage.setItem("localQueries", JSON.stringify(queries));
    }
  }, [queries]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        marginTop: "20px",
        ml: "20px",
        width: "100%",
      }}
    >
      <Paper sx={{ width: "30%", marginTop: "20px" }}>
        <List>
          {queries?.map((qry, index) => (
            <ListItem key={index}>
              <ListItemText primary={qry} />
              <ListItemSecondaryAction>
                {/* Select Button */}
                <IconButton edge="end" onClick={() => setQuery(qry)}>
                  <CheckIcon color={qry === query ? "primary" : "disabled"} />
                </IconButton>

                {/* Delete Button */}
                <IconButton edge="end" onClick={() => deleteQuery(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            DuckDB Query Interface
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            label="Write your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            margin="normal"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={executeQuery}
            style={{ marginTop: "10px" }}
            endIcon={loading && <CircularProgress size={20} />}
          >
            Run Query
          </Button>
          <Typography variant="h5" style={{ marginTop: "20px" }}>
            Results:
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {result && (
            <Paper
              elevation={1}
              style={{
                padding: "10px",
                background: "#f4f4f4",
                marginTop: "10px",
              }}
            >
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </Paper>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
