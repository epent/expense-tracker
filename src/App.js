import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBar from "./components/SideBar/SideBar";
import Home from "./Home/Home";
import NewExpenses from "./Expenses/NewExpenses";
import NewIncome from "./Income/NewIncome";
import NewTransfers from "./Transfers/NewTransfers";
import NewAccounts from "./Accounts/NewAccounts";
import TransactionList from "./components/History/TransactionList";
import Categories from "./Categories/Categories";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

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
    action: {
      active: "#ce93d8",
      hover: "#ce93d8",
    },
  },
});

function App() {
  let routes = (
    <Switch>
      <Route path="/accounts">
        <NewAccounts />
      </Route>
      <Route path="/expenses">
        <NewExpenses />
      </Route>
      <Route path="/income">
        <NewIncome />
      </Route>
      <Route path="/transfers">
        <NewTransfers />
      </Route>
      <Route path="/history">
        <TransactionList pageSize={14} pageTitle="Transaction History" />
      </Route>
      <Route path="/categories">
        <Categories showCategoryForm showEditBtn showDeleteBtn />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );

  return (
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
  );
}

export default App;
