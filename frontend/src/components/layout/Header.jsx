// src/components/Header.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const Header = ({}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Title */}
        <Typography variant="h6" component="div">
          ALPHA AI
        </Typography>

        {/* Spacer to push buttons to the right */}
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
