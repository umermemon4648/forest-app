import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ element: Element, isAdmin, path }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    // You can show a loading indicator here if needed
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return(
    <Route path={path} element={<Element />} />
  );
};

export default ProtectedRoute;
