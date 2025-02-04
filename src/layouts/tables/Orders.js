import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField"; // Import TextField for search

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(true);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://192.168.1.5:4000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data); // Initialize filteredOrders with the fetched data
        } else {
          console.error("No orders data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching orders data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter orders based on the email id in the userId field
    const filtered = orders.filter((order) =>
      order.userId.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOrders(filtered);
  };

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
                    Loading Orders Data...
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

  // Columns structure based on orders data
  const columns = [
    { Header: "User Email", accessor: "userId.email" },
    {
      Header: "Start Date",
      accessor: "startDate",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    { Header: "Milk Type", accessor: "milkType" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Price", accessor: "price" },
    {
      Header: "Order Created",
      accessor: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Order Updated",
      accessor: "updatedAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Orders Table
                </MDTypography>

                {/* Search Input placed next to the Orders Table heading */}
                <TextField
                  label="Search by Email"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{ width: 250 }} // Optional: Adjust width for the search bar
                />
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: filteredOrders }} // Use filteredOrders for the table
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
};

export default Orders;
