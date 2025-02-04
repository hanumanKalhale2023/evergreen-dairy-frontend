import { useEffect, useState } from "react";
import PropTypes from "prop-types";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function MilkPrices() {
  const [milkPrices, setMilkPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPrice, setNewPrice] = useState({ milkType: "", milkPrice: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMilkPrices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please login again");
          return;
        }
        const response = await fetch("http://localhost:4000/api/price/get-all-price", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data && Array.isArray(data)) {
          console.log("Fetched data:", data); // Log the fetched data
          setMilkPrices(data);
          setFilteredPrices(data); // Initialize filtered prices with all data
        } else {
          console.error("No milk price data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching milk price data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilkPrices();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrice({ ...newPrice, [name]: value });
  };

  const handleAddPrice = async () => {
    if (!newPrice.milkType || !newPrice.milkPrice) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch("http://localhost:4000/api/price/add-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPrice),
      });

      const data = await response.json();

      if (response.ok) {
        setMilkPrices((prevPrices) => [
          ...prevPrices,
          {
            _id: data._id,
            milkType: newPrice.milkType,
            milkPrice: newPrice.milkPrice,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          },
        ]);
        setFilteredPrices((prevPrices) => [
          ...prevPrices,
          {
            _id: data._id,
            milkType: newPrice.milkType,
            milkPrice: newPrice.milkPrice,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          },
        ]);
        setNewPrice({ milkType: "", milkPrice: "" });
        alert("Milk price added successfully!");
      } else {
        console.error("Error adding milk price:", data.message);
        alert(data.message || "Failed to add milk price.");
      }
    } catch (error) {
      console.error("Error adding milk price:", error);
      alert("An error occurred while adding the milk price.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePrice = async (id, updatedPrice) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/price/update-price/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPrice),
      });

      if (response.ok) {
        setMilkPrices((prevPrices) =>
          prevPrices.map((price) => (price._id === id ? { ...price, ...updatedPrice } : price))
        );
        setFilteredPrices((prevPrices) =>
          prevPrices.map((price) => (price._id === id ? { ...price, ...updatedPrice } : price))
        );
        alert("Milk price updated successfully!");
      } else {
        const data = await response.json();
        console.error("Error updating milk price:", data.message);
        alert(data.message || "Failed to update milk price.");
      }
    } catch (error) {
      console.error("Error updating milk price:", error);
      alert("An error occurred while updating the milk price.");
    }
  };

  const handleDeletePrice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please login again");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/price/delete-price/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMilkPrices((prevPrices) => prevPrices.filter((price) => price._id !== id));
        setFilteredPrices((prevPrices) => prevPrices.filter((price) => price._id !== id));
        alert("Milk price deleted successfully!");
      } else {
        const data = await response.json();
        console.error("Error deleting milk price:", data.message);
        alert(data.message || "Failed to delete milk price.");
      }
    } catch (error) {
      console.error("Error deleting milk price:", error);
      alert("An error occurred while deleting the milk price.");
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredPrices(milkPrices); // Reset to all prices if search query is empty
    } else {
      setFilteredPrices(
        milkPrices.filter((price) => {
          return (
            (price.createdAt?.toLowerCase?.().includes(query) ?? false) ||
            (price.milkType?.toLowerCase?.().includes(query) ?? false) ||
            (price.milkPrice?.toString?.().includes(query) ?? false)
          );
        })
      );
    }
  };
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
                    Loading Milk Prices...
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

  const columns = [
    { Header: "Milk Type", accessor: "milkType" },
    {
      Header: "Price",
      accessor: "milkPrice",
      Cell: ({ value }) => `₹ ${value ?? 0}`, // Provide a default value if milkPrice is undefined
    },
    { Header: "Created At", accessor: "createdAt" },
    { Header: "Updated At", accessor: "updatedAt" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            style={{ backgroundColor: "orange", color: "white", marginRight: "8px" }}
            onClick={() =>
              handleUpdatePrice(row.original._id, {
                milkType: row.original.milkType,
                milkPrice:
                  prompt("Enter new price:", row.original.milkPrice) || row.original.milkPrice,
              })
            }
          >
            Update
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => handleDeletePrice(row.original._id)}
          >
            Delete
          </Button>
        </>
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
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Milk Prices{" "}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox pt={3} px={3}>
                <MDTypography variant="h6" mb={2}>
                  Add Milk Price{" "}
                </MDTypography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ height: "48px" }}>
                      <InputLabel id="milk-type-label">Milk Type</InputLabel>
                      <Select
                        labelId="milk-type-label"
                        name="milkType"
                        value={newPrice.milkType}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ height: "100%", display: "flex", alignItems: "center" }}
                      >
                        <MenuItem value="Cow">Cow</MenuItem>
                        <MenuItem value="Buffalo">Buffalo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      name="milkPrice"
                      type="number"
                      value={newPrice.milkPrice}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={handleAddPrice}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Price"}
                    </Button>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", flexDirection: "column", height: "400px" }}>
                <MDBox sx={{ flex: 1, overflow: "auto" }}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h6">Milk Prices</MDTypography>
                    <TextField
                      label="Search"
                      variant="outlined"
                      size="small"
                      value={searchQuery}
                      onChange={handleSearchChange}
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

                  <DataTable
                    table={{ columns, rows: filteredPrices }}
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

export default MilkPrices;

// Define propTypes for the MilkPrices component
MilkPrices.propTypes = {
  row: PropTypes.oneOfType([
    PropTypes.shape({
      original: PropTypes.shape({
        _id: PropTypes.string,
        milkType: PropTypes.string,
        milkPrice: PropTypes.number,
      }),
    }),
    PropTypes.null,
  ]),
};
