import { useEffect, useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function DailyEntries() {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDailyEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please login again");
          return;
        }
        const response = await fetch("http://localhost:4000/api/entries/daily-entry", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.dailyEntries && Array.isArray(data.dailyEntries)) {
          setDailyEntries(data.dailyEntries);
          setFilteredEntries(data.dailyEntries);
        } else {
          console.error("No daily entries found in the response.");
        }
      } catch (error) {
        console.error("Error fetching daily entries data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyEntries();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const filtered = dailyEntries.filter((entry) => {
      return (
        entry.userId.email.toLowerCase().includes(query) ||
        entry.quantity.toString().includes(query)
      );
    });
    setFilteredEntries(filtered);
  };

  const columns = [
    { Header: "User Email", accessor: "userId.email" },
    { Header: "Attendance", accessor: "attendance" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Date", accessor: "date" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Daily Entries
                </MDTypography>
                <TextField
                  label="Search by Email or Quantity"
                  value={searchQuery}
                  onChange={handleSearch}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: 250, // Adjust width
                    backgroundColor: "#ffffff",
                    borderRadius: "10px", // Set background color to white
                    color: "black", // Set text color to black
                    "& .MuiInputBase-root": {
                      color: "black", // Ensure the input text color is black
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Optional: Add border color if needed
                      },
                      "&:hover fieldset": {
                        borderColor: "black", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black", // Border color when focused
                      },
                    },
                  }}
                />
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: filteredEntries }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DailyEntries;
