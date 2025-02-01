import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const TableComponent = ({ data, width, height, query }) => {
  // Check if data is valid and not empty
  if (!data || data.length === 0) {
    return (
      <div style={{ marginTop: "20px" }}>
        <span>{`No data available for this query.`}</span>
        <br />
        <span>{query}</span>
      </div>
    );
  }

  // Get column headers (keys from the first data row)
  const columns = Object.keys(data[0]);

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          height: height, // Make the container take full height of the parent
          width: width, // Make the container take full width of the parent
          overflow: "auto", // Add scrollbars if the content overflows
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "white", // Optional: Set a background color to cover content below
              zIndex: 1, // Ensure the header is above the table body
            }}
          >
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableComponent;
