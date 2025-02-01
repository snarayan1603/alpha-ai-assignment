// MUI File Upload Component with Drag & Drop (Bigger UI)

import { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select or drop a file first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:4500/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/dashboard?dbName=" + response.data.dbName);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.error);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "30px" }}>
      <Paper elevation={3} style={{ padding: "30px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Upload File
        </Typography>
        <div
          {...getRootProps()}
          style={{
            border: "3px dashed #aaa",
            padding: "40px",
            cursor: "pointer",
            background: isDragActive ? "#f0f0f0" : "white",
            fontSize: "18px",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <Typography>
              Drag & drop a file here, or click to select one
            </Typography>
          )}
        </div>
        {file && (
          <Typography
            variant="body1"
            style={{ marginTop: "15px", fontSize: "16px" }}
          >
            Selected File: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          style={{ marginTop: "15px", padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
          endIcon={loading && <CircularProgress size={24} />}
        >
          Upload
        </Button>
        {error ? (
          <Alert severity="error" style={{ marginTop: "15px" }}>
            {error}
          </Alert>
        ) : (
          message && (
            <Alert severity="warning" style={{ marginTop: "15px" }}>
              {message}
            </Alert>
          )
        )}
      </Paper>
    </Container>
  );
}

export default FileUpload;
