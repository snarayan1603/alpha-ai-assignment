// src/components/Header.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header = ({}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Title */}
        <Typography variant="h6" component="div">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            {" "}
            ALPHA AI
          </Link>
        </Typography>

        {/* Spacer to push buttons to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Buttons */}
        <Link to="/upload" style={{ color: "white", textDecoration: "none" }}>
          Upload
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
