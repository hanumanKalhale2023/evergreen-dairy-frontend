import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/logos/evergreen.jpg";
import logo from "assets/images/logos/evergreen.png"; // Import your logo here
import axios from "axios";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [adminId, setAdminId] = useState(""); // State for adminId
  const [password, setPassword] = useState(""); // State for password
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error message
  const navigate = useNavigate(); // Hook for navigation

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Update states for adminId and password input
  const handleAdminIdChange = (e) => setAdminId(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      adminId: adminId,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/admin/login", payload);

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);

        alert(response.data.message || "Login successful! Redirecting to the dashboard...");
        navigate("/dashboard"); // Navigate to the dashboard
      } else {
        setErrorMessage("Login failed: " + (response.data.message || "Unknown error"));
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error logging in", error);
      setErrorMessage("Error logging in. Please try again later.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={1}
          p={2}
          mb={1}
          textAlign="center"
        >
          {/* Add the logo at the top */}
          <MDBox mb={5}>
            <img
              src={logo} // Your logo image path
              alt="Logo"
              style={{
                maxWidth: "120px", // Reduced size of the logo
                marginBottom: "16px",
              }}
            />
          </MDBox>
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Admin Login
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Admin ID"
                fullWidth
                value={adminId} // Bind input value to adminId state
                onChange={handleAdminIdChange} // Handle change for adminId
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password} // Bind input value to password state
                onChange={handlePasswordChange} // Handle change for password
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Log in
              </MDButton>
            </MDBox>
            {errorMessage && (
              <MDTypography variant="body2" color="error" textAlign="center">
                {errorMessage}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
