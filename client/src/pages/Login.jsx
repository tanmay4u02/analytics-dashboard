import React, { useState, useContext } from "react";
import { Button, TextField, Container, Typography, Link } from "@mui/material";
import axios from "../config/axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { login, token, errorMessage } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(errorMessage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const response = await axios.post("/auth/signup", { email, password });
        const { token, userId } = response.data;
        login({ token, id: userId });
      } else {
        const response = await axios.post("/auth/login", { email, password });
        const { token, userId } = response.data;
        login({ token, id: userId });
      }
    } catch (error) {
      setError(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: "10rem" }}>
      <Typography variant="h4" gutterBottom>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        {error && (
          <Typography color="error" sx={{ mb: "0.5rem" }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
        </Button>
      </form>

      <Link
        href="#"
        onClick={() => setIsSignup(!isSignup)}
        style={{ display: "block", marginTop: "1rem", textAlign: "center" }}
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don’t have an account? Sign Up"}
      </Link>
    </Container>
  );
};

export default Login;
