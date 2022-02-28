import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBar from "./SideBar/SideBar";
import Home from "./Home/Home";
import Expenses from "./Transactions/Expenses/Expenses";
import Income from "./Transactions/Income/Income";
import Transfers from "./Transactions/Transfers/Transfers";
import Accounts from "./AccountsCategories/Accounts/Accounts";
import Categories from "./AccountsCategories/Categories/Categories";
import TransactionList from "./Transactions/TransactionList";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from "@mui/material/styles";

const theme = createTheme(adaptV4Theme({
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
    action: {
      active: "#d1c4e9",
      hover: "#d1c4e9",
    },
  },
}));

function App() {
  let routes = (
    <Switch>
      <Route path="/accounts">
        <Accounts />
      </Route>
      <Route path="/expenses">
        <Expenses />
      </Route>
      <Route path="/income">
        <Income />
      </Route>
      <Route path="/transfers">
        <Transfers />
      </Route>
      <Route path="/history">
        <TransactionList pageSize={14} pageTitle="Transaction History" />
      </Route>
      <Route path="/categories">
        <Categories />
      </Route>
      <Route path="/">
        <Home />
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
            </Grid>
          </Grid>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
