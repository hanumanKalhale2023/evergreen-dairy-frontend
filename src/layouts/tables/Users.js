import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
// @mui material components
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Select, MenuItem } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ userName: "", email: "", password: "" });
  const [openForm, setOpenForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrderUserId, setSelectedOrderUserId] = useState(null);
  const [openOrderForm, setOpenOrderForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    startDate: "",
    endDate: "",
    milkType: "",
    quantity: 0,
    price: 0,
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    startDate: "",
    endDate: "",
    milkType: "Cow", // Default value
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please login again");
          return;
        }
        const response = await fetch("https://milkdairy-2.onrender.com/api/admin/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("No user data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch(
        `https://milkdairy-2.onrender.com/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("User deleted successfully!");
        // Refresh the users list after deletion
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      } else {
        const data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) => {
    return (
      user.userName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });
  //update user
  const handleUpdateUser = async (userId, updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch(
        `https://milkdairy-2.onrender.com/api/admin/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        alert("User updated successfully!");
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, ...updatedUser } : user
        );
        setUsers(updatedUsers);
        setOpenUpdateForm(false); // Close the update form
      } else {
        const data = await response.json();
        console.error("Error updating user:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    }
  };
  const handleCreateOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      // Ensure milkType is correctly set
      const { startDate, endDate, milkType, quantity, price } = newOrder;

      if (!selectedOrderUserId || !startDate || !endDate || !milkType || !quantity || !price) {
        alert("Please fill in all required fields.");
        return;
      }

      const response = await fetch("https://milkdairy-2.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedOrderUserId,
          startDate,
          endDate,
          milkType,
          quantity,
          price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order created successfully!");
        setOpenOrderForm(false);
        setNewOrder({
          startDate: "",
          endDate: "",
          milkType: "",
          quantity: 0,
          price: 0,
        });
        navigate(`/orders/${data.order._id}`);
      } else {
        console.error("Error creating order:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };
  const handleCreateInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch("https://milkdairy-2.onrender.com/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedOrderUserId, ...invoiceData }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Invoice generated successfully!");

        const doc = new jsPDF();
        const img = new Image();
        img.src = "/evergreen.png"; // Ensure this image is in the 'public' folder

        img.onload = function () {
          // Add the logo at the top-left corner (full opacity)
          doc.addImage(img, "PNG", 10, 10, 40, 40); // (x, y, width, height)

          // Set text color to black for better visibility
          doc.setTextColor(0, 0, 0);

          // Add company name and invoice title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(20);
          doc.text("Evergreen Dairy", 105, 20, { align: "center" });

          // Add invoice title
          doc.setFontSize(16);
          doc.text("Invoice", 105, 35, { align: "center" });

          // Add invoice details
          doc.setFontSize(12);
          doc.text(
            `Invoice Date: ${new Date(data.invoice.invoiceDate).toLocaleDateString()}`,
            10,
            55
          );
          doc.text(`User Name: ${data.invoice.userName || "N/A"}`, 130, 55);

          // Generate random Invoice ID
          const invoiceId = Math.floor(Math.random() * 1000000);

          // Table header
          const tableColumns = [
            { title: "Start Date", dataKey: "startDate" },
            { title: "End Date", dataKey: "endDate" },
            { title: "Milk Type", dataKey: "milkType" },
            { title: "Quantity", dataKey: "totalQuantity" },
          ];

          const tableData = [
            {
              startDate: new Date(data.invoice.startDate).toLocaleDateString(),
              endDate: new Date(data.invoice.endDate).toLocaleDateString(),
              milkType: data.invoice.milkType,
              totalQuantity: data.invoice.totalQuantity,
            },
          ];

          // Generate the first table for invoice details
          doc.autoTable({
            head: [tableColumns.map((col) => col.title)],
            body: tableData.map((item) => tableColumns.map((col) => item[col.dataKey])),
            startY: 70, // Start the table after the text
            theme: "striped", // Use a striped theme for a modern look
            headStyles: { fillColor: [22, 160, 133] }, // Greenish header color
            bodyStyles: { valign: "middle" },
            styles: {
              font: "helvetica",
              fontSize: 10,
            },
          });

          // Add a second table for present/absent days
          const summaryColumns = [
            { title: "Present Days", dataKey: "presentDays" },
            { title: "Absent Days", dataKey: "absentDays" },
          ];

          const summaryData = [
            {
              presentDays: data.invoice.presentDaysCount,
              absentDays: data.invoice.absentDaysCount,
            },
          ];

          doc.autoTable({
            head: [summaryColumns.map((col) => col.title)],
            body: summaryData.map((item) => summaryColumns.map((col) => item[col.dataKey])),
            startY: doc.lastAutoTable.finalY + 10, // Start below the first table
            theme: "striped",
            headStyles: { fillColor: [52, 152, 219] }, // Blue header color
            bodyStyles: { valign: "middle" },
            styles: {
              font: "helvetica",
              fontSize: 10,
            },
          });

          // Add a third table for Invoice ID & Total Amount
          const invoiceColumns = [
            { title: "Invoice ID", dataKey: "invoiceId" },
            { title: "Total Amount (Rupee)", dataKey: "totalAmount" },
          ];

          const invoiceData = [
            {
              invoiceId: `INV-${invoiceId}`, // Adding "INV-" prefix
              totalAmount: data.invoice.totalAmount,
            },
          ];

          doc.autoTable({
            head: [invoiceColumns.map((col) => col.title)],
            body: invoiceData.map((item) => invoiceColumns.map((col) => item[col.dataKey])),
            startY: doc.lastAutoTable.finalY + 10, // Start below the second table
            theme: "grid",
            headStyles: { fillColor: [231, 76, 60] }, // Red header color for distinction
            bodyStyles: { valign: "middle" },
            styles: {
              font: "helvetica",
              fontSize: 10,
            },
          });

          // Add footer
          doc.setFontSize(10);
          doc.text("Thank you for choosing Evergreen Dairy!", 105, 280, { align: "center" });
          doc.text("Contact us: support@evergreendairy.com | +91 12345 67890", 105, 285, {
            align: "center",
          });

          // Save the PDF
          doc.save("invoice.pdf");
        };
      } else {
        alert(" " + data.message);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const columns = [
    { Header: "User Name", accessor: "userName" },
    { Header: "Email", accessor: "email" },
    {
      Header: "Account Created",
      accessor: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "red", color: "white" }}
            onClick={() => handleDeleteUser(row.original._id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "orange", color: "white" }}
            onClick={() => {
              setSelectedUser(row.original);
              setOpenUpdateForm(true);
            }}
          >
            Update
          </Button>
        </MDBox>
      ),
    },
    {
      Header: "Orders",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "blue", color: "white" }}
          onClick={() => {
            setSelectedOrderUserId(row.original._id);
            setOpenOrderForm(true);
          }}
        >
          Create Order
        </Button>
      ),
    },
    {
      Header: "Invoice",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "green", color: "white" }}
          onClick={() => {
            setSelectedOrderUserId(row.original._id);
            setOpenInvoiceForm(true);
          }}
        >
          Generate Invoice
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDTypography>Loading Users...</MDTypography>
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
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Users Table
                  </MDTypography>
                  {/* Search input */}
                  <TextField
                    label="Search by Username or Email"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
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
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: filteredUsers }} // Use filtered users here
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

      {/* Create Order Modal */}
      <Dialog open={openOrderForm} onClose={() => setOpenOrderForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          <MDBox display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newOrder.startDate}
              onChange={(e) => setNewOrder({ ...newOrder, startDate: e.target.value })}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newOrder.endDate}
              onChange={(e) => setNewOrder({ ...newOrder, endDate: e.target.value })}
            />
            <TextField
              label="Milk Type"
              fullWidth
              value={newOrder.milkType}
              onChange={(e) => setNewOrder({ ...newOrder, milkType: e.target.value })}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={newOrder.quantity}
              onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newOrder.price}
              onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderForm(false)} sx={{ color: "blue" }}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrder} sx={{ color: "white", backgroundColor: "blue" }}>
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
      {/* update user model */}
      <Dialog
        open={openUpdateForm}
        onClose={() => setOpenUpdateForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <MDBox display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="User Name"
              fullWidth
              value={selectedUser?.userName || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={selectedUser?.email || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateForm(false)} sx={{ color: "blue" }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateUser(selectedUser?._id, selectedUser)}
            sx={{ color: "white", backgroundColor: "orange" }}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>
      {/* Create Invoice Modal */}
      <Dialog
        open={openInvoiceForm}
        onClose={() => setOpenInvoiceForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <MDBox display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.startDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, startDate: e.target.value })}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.endDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, endDate: e.target.value })}
            />
            <Select
              label="Milk Type"
              value={invoiceData.milkType}
              onChange={(e) => setInvoiceData({ ...invoiceData, milkType: e.target.value })}
              fullWidth
            >
              <MenuItem value="Cow">Cow</MenuItem>
              <MenuItem value="Buffalo">Buffalo</MenuItem>
            </Select>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoiceForm(false)} sx={{ color: "blue" }}>
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice} sx={{ color: "white", backgroundColor: "green" }}>
            Create Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

Users.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      // Add other properties of row.original here if needed
    }).isRequired,
    // Add other properties of row here if needed
  }).isRequired,
};

export default Users;
