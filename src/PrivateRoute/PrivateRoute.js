import React from "react";
import { BrowserRouter as Route, Redirect } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const authToken = localStorage.getItem("token");

  if (!authToken) {
    return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
  }

  return <Route>{children}</Route>;
};

export default PrivateRoute;
