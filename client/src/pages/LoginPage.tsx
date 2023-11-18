import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { filledButtonStyle, textFieldStyle } from "../styles/commonStyles";
import { usePostLoginUser } from "../requests/users";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: loginUserMutation } = usePostLoginUser();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUserMutation({
        email: email,
        password: password,
      });

      if (response.success) {
        navigate("/");
      }

      // Clear any previous error message
      setErrorMessage("");
    } catch (error) {
      console.error("Error logging in user:", error);

      // Handle unauthorized error
      if (error.message === "Unauthorized") {
        setErrorMessage("Incorrect username or password");
      } else {
        setErrorMessage("An error occurred while logging in");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "var(--color-gray1)",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 10,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 1, color: "var(--color-pink1)", fontWeight: "bold" }}
          >
            ScheduleIT
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: "10px",
            backgroundColor: "white",
            padding: "16px",
          }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={textFieldStyle}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={textFieldStyle}
          />
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              ...filledButtonStyle,
              fontWeight: "bold",
            }}
            fullWidth
            onClick={handleLogin}
          >
            Log in
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
