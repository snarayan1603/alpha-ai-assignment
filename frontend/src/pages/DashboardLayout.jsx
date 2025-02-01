import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QueryInput from "../components/input/QueryInput";
import TableComponent from "../components/table/TableComponent";
import QueryForm from "../components/input/QueryForm";
import { Download, Fullscreen } from "@mui/icons-material";

function DashboardLayout() {
  const [query, setQuery] = useState("");
  const [schema, setSchema] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sampleQueries, setSampleQueries] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dbName = searchParams.get("dbName"); // Extract dbName from URL

  async function fetDefaultData(dbName) {
    const { data } = await axios.get(
      "http://localhost:4500/api/defaultData?dbName=" + dbName
    );
    setSchema(data.schema);
    setSampleQueries(data.queries);
    console.log(data);
  }

  useEffect(() => {
    if (dbName) fetDefaultData(dbName);
  }, [dbName]);

  const handleFullScreen = () => {
    setIsFullScreen((prev) => !prev); // Toggle fullscreen mode
  };

  const handleDownloadCSV = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4500/api/download-csv",
        { query },
        {
          responseType: "blob", // Important to receive the file as a Blob
        }
      );

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(response.data);
      link.download = "result.csv"; // You can customize the filename
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {isFullScreen ? (
        <Box style={{ position: "relative", marginTop: "40px" }}>
          <Button
            variant="text"
            color="primary"
            style={{
              position: "absolute",
              top: "-40px",
              right: "0px",
              zIndex: 1, // Ensure button stays on top of the content
            }}
            onClick={handleFullScreen}
          >
            X
          </Button>

          <TableComponent
            data={tableData}
            width={"100vw"}
            height={`calc(100vh - 110px)`}
            query={query}
          />
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          style={{ height: `calc(100vh - 50px)`, padding: "10px" }}
        >
          {/* Left Column (40%) */}
          <Grid item xs={12} md={5} container direction="column" spacing={2}>
            {/* Upper Half (50%) */}
            <Grid item style={{ flex: 1 }}>
              <Paper elevation={3} style={{ padding: "10px", height: "100%" }}>
                <QueryInput
                  setQuery={setQuery}
                  sampleQueries={sampleQueries}
                  schema={schema}
                  dbName={dbName}
                />
              </Paper>
            </Grid>
            {/* Lower Half (50%) */}
            <Grid item style={{ flex: 1 }}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                {/* <Typography variant="h6">Section 2</Typography> */}
                <TableComponent data={schema} width={580} height={300} />
              </Paper>
            </Grid>
          </Grid>

          {/* Right Column (60%) */}
          <Grid item xs={12} md={7} container direction="column" spacing={2}>
            {/* Upper Row (30%) */}
            <Grid item style={{ flex: 0.1 }}>
              <Paper elevation={3} style={{ padding: "10px", height: "100%" }}>
                {/* <Typography variant="h6">Section 3</Typography> */}
                <QueryForm
                  query={query}
                  setTableData={setTableData}
                  setQuery={setQuery}
                  dbName={dbName}
                />
              </Paper>
            </Grid>
            {/* Lower Row (70%) */}
            <Grid item style={{ flex: 0.9 }}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                {tableData ? (
                  <Box>
                    {tableData.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                        }}
                      >
                        {/* Full Screen Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Fullscreen />}
                          onClick={handleFullScreen}
                          sx={{ marginRight: 2 }}
                        >
                          Full Screen
                        </Button>

                        {/* Download CSV Button */}
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Download />}
                          onClick={handleDownloadCSV}
                          endIcon={loading && <CircularProgress size={24} />}
                          disabled={loading}
                        >
                          Download CSV
                        </Button>
                      </Box>
                    )}
                    <TableComponent
                      data={tableData}
                      width={820}
                      height={400}
                      query={query}
                    />
                  </Box>
                ) : (
                  <Typography variant="h6">No Data Available.</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DashboardLayout;
