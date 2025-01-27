import { useEffect, useState } from "react";

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

function Schools() {
  // State to store school data and loading state
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching school data from the API
    const fetchSchools = async () => {
      try {
        const response = await fetch("https://api.blissiq.cloud/admin.getAll/school");
        const data = await response.json();

        // Access the 'data' key from the response object
        if (data && data.success) {
          setSchools(data.data); // Assuming the schools array is in the 'data' key
        } else {
          console.error("No school data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching school data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // If still loading, show a loading indicator
  if (loading) {
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
                >
                  <MDTypography variant="h6" color="white">
                    Loading Schools Data...
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Columns structure based on school data (without Phone)
  const columns = [
    { Header: "School Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "Board", accessor: "board" },
    { Header: "Staff", accessor: "staff" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Active",
      accessor: "isActive",
      Cell: ({ value }) => (value ? "Active" : "Inactive"),
    },
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
              >
                <MDTypography variant="h6" color="white">
                  Schools Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: schools }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Schools;
