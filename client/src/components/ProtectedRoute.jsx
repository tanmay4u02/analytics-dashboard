import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const { token } = useContext(AuthContext);
  return token ? children : <Navigate state={{ from: location }} to="/login" />;
};

export default ProtectedRoute;
