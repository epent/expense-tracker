import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBar from "./SideBar/SideBar";
import Home from "./Home/Home";
import Expenses from "./Transactions/Expenses/Expenses";
import Income from "./Transactions/Income/Income";
import Transfers from "./Transactions/Transfers/Transfers";
import Accounts from "./AccountsCategories/Accounts/Accounts";
import Categories from "./AccountsCategories/Categories/Categories";
import TransactionList from "./Transactions/TransactionList";
import SignUp from "./SignUp/SignUp";
import LogIn from "./LogIn/LogIn";
import ErrorHandler from "./ErrorHandler/ErrorHandler";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#b2dfdb",
      main: "#26a69a",
      dark: "#009688",
    },
    secondary: {
      light: "#d1c4e9",
      main: "#9575cd",
      dark: "#673ab7",
    },
    transfer: {
      light: "#cfd8dc",
      main: "#90a4ae",
      dark: "#607d8b",
    },
    action: {
      active: "#d1c4e9",
      hover: "#d1c4e9",
    },
  },
});

function App() {
  const [openErrorHandler, setOpenErrorHandler] = useState(false);
  const [errorMesasage, setErrorMesage] = useState("");

  const handleOpen = (message) => {
    setOpenErrorHandler(true);
    setErrorMesage(message);
  };
  const handleClose = () => setOpenErrorHandler(false);

  let routes = (
    <Switch>
      <Route path="/signup">
        <SignUp openErrorDialog={handleOpen} />
      </Route>
      <Route path="/login">
        <LogIn openErrorDialog={handleOpen} />
      </Route>
      <Route path="/accounts">
        <Accounts openErrorDialog={handleOpen} />
      </Route>
      <Route path="/expenses">
        <Expenses openErrorDialog={handleOpen} />
      </Route>
      <Route path="/income">
        <Income openErrorDialog={handleOpen} />
      </Route>
      <Route path="/transfers">
        <Transfers openErrorDialog={handleOpen} />
      </Route>
      <Route path="/history">
        <TransactionList pageSize={14} pageTitle="Transaction History" />
      </Route>
      <Route path="/categories">
        <Categories openErrorDialog={handleOpen} />
      </Route>
      <Route path="/">
        <Home openErrorDialog={handleOpen} />
      </Route>
    </Switch>
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <Grid container>
            <Grid item lg={2}>
              <SideBar />
            </Grid>
            <Grid item xs={12} lg={10}>
              <Toolbar />
              <Box m={3}>{routes}</Box>
              <ErrorHandler
                handleClose={handleClose}
                open={openErrorHandler}
                errorMesasage={errorMesasage}
              />
            </Grid>
          </Grid>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
