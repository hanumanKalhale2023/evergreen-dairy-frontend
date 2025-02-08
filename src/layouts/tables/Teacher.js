import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // State for the modal
  const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch("https://milkdairy-2.onrender.com/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
        setFilteredOrders(data);
      } else {
        console.error("No orders data found in the response.");
      }
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = orders.filter((order) =>
      order.userId.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOrders(filtered);
  };

  // Handle update order
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch(
        `https://milkdairy-2.onrender.com/api/orders/${updatedOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: updatedOrder.userId,
            startDate: updatedOrder.startDate,
            endDate: updatedOrder.endDate,
            milkType: updatedOrder.milkType,
            quantity: updatedOrder.quantity,
            price: updatedOrder.price,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Order updated successfully:", data);
        setSuccessMessage("Order updated successfully");
        // Refresh orders data
        fetchOrders();
        // Close the modal
        setOpen(false);
      } else {
        console.error("Error updating order:", data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch(`https://milkdairy-2.onrender.com/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Order deleted successfully:", data);
        setSuccessMessage("Order deleted successfully");
        // Refresh orders data
        fetchOrders();
      } else {
        console.error("Error deleting order:", data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Handle open/close modal
  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  // Handle success message close
  const handleSuccessMessageClose = () => {
    setSuccessMessage(null);
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
    {
      Header: "End Date",
      accessor: "endDate",
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
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button variant="contained" color="primary" onClick={() => handleOpen(row.original)}>
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteOrder(row.original._id)}
          >
            Delete
          </Button>
        </MDBox>
      ),
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

                <TextField
                  label="Search by Email"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{
                    width: 250,
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    color: "black",
                    "& .MuiInputBase-root": {
                      color: "black",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <DataTable
                    table={{ columns, rows: filteredOrders }}
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

      {/* Modal for updating orders */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <DialogContentText>Update the order details below.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="startDate"
                label="Start Date"
                type="date"
                defaultValue={
                  selectedOrder.startDate
                    ? new Date(selectedOrder.startDate).toISOString().split("T")[0]
                    : ""
                }
                fullWidth
                variant="standard"
                onChange={(e) => setSelectedOrder({ ...selectedOrder, startDate: e.target.value })}
              />
              <TextField
                margin="dense"
                id="endDate"
                label="End Date"
                type="date"
                defaultValue={
                  selectedOrder.endDate
                    ? new Date(selectedOrder.endDate).toISOString().split("T")[0]
                    : ""
                }
                fullWidth
                variant="standard"
                onChange={(e) => setSelectedOrder({ ...selectedOrder, endDate: e.target.value })}
              />
              <TextField
                margin="dense"
                id="milkType"
                label="Milk Type"
                type="text"
                defaultValue={selectedOrder.milkType || ""}
                fullWidth
                variant="standard"
                onChange={(e) => setSelectedOrder({ ...selectedOrder, milkType: e.target.value })}
              />
              <TextField
                margin="dense"
                id="quantity"
                label="Quantity"
                type="number"
                defaultValue={selectedOrder.quantity || ""}
                fullWidth
                variant="standard"
                onChange={(e) => setSelectedOrder({ ...selectedOrder, quantity: e.target.value })}
              />
              <TextField
                margin="dense"
                id="price"
                label="Price"
                type="number"
                defaultValue={selectedOrder.price || ""}
                fullWidth
                variant="standard"
                onChange={(e) => setSelectedOrder({ ...selectedOrder, price: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleUpdateOrder(selectedOrder)}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Success Message Snackbar */}
      <Snackbar
        open={successMessage !== null}
        autoHideDuration={3000}
        onClose={handleSuccessMessageClose}
      >
        <Alert onClose={handleSuccessMessageClose} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Orders;
