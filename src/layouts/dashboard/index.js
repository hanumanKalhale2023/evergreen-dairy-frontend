// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import axios from "axios";
import { useEffect, useState } from "react";

// Other components
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0); // Added state for orders
  const [milkPrices, setMilkPrices] = useState({ cowPrice: 0, buffaloPrice: 0 }); // Added state for milk prices

  // Fetch users count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://localhost:4000/api/admin/all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserCount(data.length);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserCount();
  }, []);

  // Fetch all orders count
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://localhost:4000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setOrderCount(data.length); // Setting order count
      } catch (error) {
        console.error("Error fetching orders data", error);
      }
    };

    fetchOrderCount();
  }, []);

  // Fetch Milk Prices
  // Fetch Milk Prices
  useEffect(() => {
    const fetchMilkPrices = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const response = await fetch("http://localhost:4000/api/price/get-all-price", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Assuming the response contains milk prices like:
        // [{ "milkType": "Buffalo", "milkPrice": 56 }, { "milkType": "Cow", "milkPrice": 64 }]

        const buffaloPrice =
          data.find((item) => item.milkType.toLowerCase() === "buffalow")?.milkPrice || 0;
        const cowPrice = data.find((item) => item.milkType.toLowerCase() === "cow")?.milkPrice || 0;

        setMilkPrices({ cowPrice, buffaloPrice });
      } catch (error) {
        console.error("Error fetching milk price data", error);
      }
    };

    fetchMilkPrices();
  }, []);

  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Users"
                count={userCount}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          {/* Changed this section to display order count */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="All Orders"
                count={orderCount}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          {/* Replaced "Revenue" with Milk Price */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Milk Price (Cow)"
                count={`₹${milkPrices.cowPrice}`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="store"
                title="Milk Price (Buffalo)"
                count={`₹${milkPrices.buffaloPrice}`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
