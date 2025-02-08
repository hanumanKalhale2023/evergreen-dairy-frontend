import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

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
  const [loading, setLoading] = useState(true);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateOrderData, setUpdateOrderData] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    milkType: "",
    quantity: 0,
    price: 0,
  });
  const navigate = useNavigate();

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

    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = orders.filter((order) =>
      order.userId.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOrders(filtered);
  };

  const handleOpenUpdateForm = (order) => {
    setSelectedOrder(order);
    setUpdateOrderData({
      userId: order.userId._id,
      startDate: order.startDate,
      endDate: order.endDate,
      milkType: order.milkType,
      quantity: order.quantity,
      price: order.price,
    });
    setOpenUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setSelectedOrder(null);
    setUpdateOrderData({
      userId: "",
      startDate: "",
      endDate: "",
      milkType: "",
      quantity: 0,
      price: 0,
    });
    setOpenUpdateForm(false);
  };

  const handleUpdateOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch(`http://192.168.1.5:4000/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateOrderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order updated successfully!");
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id ? { ...order, ...updateOrderData } : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        handleCloseUpdateForm();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch(`http://192.168.1.5:4000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order deleted successfully!");
        const updatedOrders = orders.filter((order) => order._id !== orderId);
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    }
  };

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
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "orange", color: "white" }}
            onClick={() => handleOpenUpdateForm(row.original)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "red", color: "white" }}
            onClick={() => handleDeleteOrder(row.original._id)}
          >
            Delete
          </Button>
        </MDBox>
      ),
    },
  ];

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
                  sx={{ width: 250 }}
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

      {/* Update Order Modal */}
      <Dialog open={openUpdateForm} onClose={handleCloseUpdateForm} fullWidth maxWidth="sm">
        <DialogTitle>Update Order</DialogTitle>
        <DialogContent>
          <MDBox display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="User ID"
              fullWidth
              value={updateOrderData.userId}
              onChange={(e) => setUpdateOrderData({ ...updateOrderData, userId: e.target.value })}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={new Date(updateOrderData.startDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setUpdateOrderData({ ...updateOrderData, startDate: e.target.value })
              }
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={new Date(updateOrderData.endDate).toISOString().split("T")[0]}
              onChange={(e) => setUpdateOrderData({ ...updateOrderData, endDate: e.target.value })}
            />
            <TextField
              label="Milk Type"
              fullWidth
              value={updateOrderData.milkType}
              onChange={(e) => setUpdateOrderData({ ...updateOrderData, milkType: e.target.value })}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={updateOrderData.quantity}
              onChange={(e) => setUpdateOrderData({ ...updateOrderData, quantity: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={updateOrderData.price}
              onChange={(e) => setUpdateOrderData({ ...updateOrderData, price: e.target.value })}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateForm} sx={{ color: "blue" }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateOrder} sx={{ color: "white", backgroundColor: "orange" }}>
            Update Order
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Orders;
