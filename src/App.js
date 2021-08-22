import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Appbar from "./Appbar";
import SideBar from "./components/SideBar/SideBar";
import Home from "./components/Home";
import Expenses from "./components/Expenses";
import Income from "./components/Income";
import Transfers from "./components/Transfers";
import Accounts from "./components/Accounts";
import HistoryLog from "./History/HistoryLog";
import Categories from "./components/Categories";

import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#a5d6a7",
      main: "#43a047",
      dark: "#2e7d32",
    },
    secondary: {
      light: "#ce93d8",
      main: "#ab47bc",
      dark: "#2e7d32",
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
        <Accounts showAccountForm showEditBtn showDeleteBtn />
      </Route>
      <Route path="/expenses">
        <Expenses showExpenseLog showExpenseForm />
      </Route>
      <Route path="/income">
        <Income showIncomeLog showIncomeForm />
      </Route>
      <Route path="/transfers">
        <Transfers showTransferLog showTransferForm />
      </Route>
      <Route path="/history" component={HistoryLog} />
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
      <Appbar />
      <Router>
        <Grid container>
          <Grid item xs={2}>
            <SideBar />
          </Grid>
          <Grid item xs={10}>
            <Toolbar />
            {routes}
          </Grid>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}

export default App;
