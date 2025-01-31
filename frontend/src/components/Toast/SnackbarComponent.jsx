// Inside your React component:
import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarComponent = ({ snackbar, setSnackbar }) => {
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={snackbar?.open}
      autoHideDuration={4000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <div>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </div>
    </Snackbar>
  );
};

export default SnackbarComponent;
