import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Appbar from "./components/Appbar/Appbar";
import SideBar from "./components/SideBar/SideBar";
import Home from "./Home/Home";
import Expenses from "./Expenses/Expenses";
import Income from "./Income/Income";
import Transfers from "./Transfers/Transfers";
import Accounts from "./Accounts/Accounts";
import HistoryLog from "./components/History/HistoryLog";
import Categories from "./Categories/Categories";

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
