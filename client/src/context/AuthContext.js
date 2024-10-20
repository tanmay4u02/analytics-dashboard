import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const checkTokenExpiry = () => {
    if (token) {
      if (jwtDecode(token).exp * 1000 < Date.now()) {
        setErrorMessage("Token has expired. Please Login again");
        logout();
        return true;
      }
    }
  };

  // Check for token in localStorage and set user state
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decodedToken = jwtDecode(savedToken);
      setToken(savedToken);
      setUser({
        id: decodedToken.userId,
      });
    }

    if (token) {
      const expired = checkTokenExpiry();
      if (!expired) {
        const decodedToken = jwtDecode(savedToken);
        setUser({
          id: decodedToken.userId,
        });

        // Check Token expiry every 15 min
        const interval = setInterval(() => {
          checkTokenExpiry();
        }, 900000);
        return () => clearInterval(interval);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (loginData) => {
    const { token } = loginData;
    localStorage.setItem("token", token);
    setToken(token);

    const decodedToken = jwtDecode(token);
    setUser({ userId: decodedToken.userId });

    const from = `${location.state?.from?.pathname || "/dashboard"}${
      location.state?.from?.search || ""
    }`;
    navigate(from, { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, errorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
