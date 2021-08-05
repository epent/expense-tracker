import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBar from "./SideBar";
import Home from "./Home";
import Expenses from "./Expenses";
import Income from "./Income";
import Transfers from "./Transfers";
import Accounts from "./Accounts";
import HistoryLog from "./History/HistoryLog";
import Categories from "./Categories";

import Grid from "@material-ui/core/Grid";
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
  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: 0,
  });

  // add new category
  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Category form submitted: ");
    console.log(categoryForm);

    //  post new categoryForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json",
      {
        method: "POST",
        body: JSON.stringify(categoryForm),
      }
    ).then((response) => {
      setCategoryForm({
        Name: "",
        Balance: 0,
      });
    });
  };

  let routes = (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
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
      <Route path="/history" component={HistoryLog} />
      <Route path="/categories">
        <Categories
          categoryForm={categoryForm}
          categoryFormSubmitHandler={categoryFormSubmitHandler}
          setCategoryForm={setCategoryForm}
        />
      </Route>
    </Switch>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Grid container>
          <Grid item xs={4}>
            <SideBar />
          </Grid>
          <Grid item xs={8}>
            {routes}
          </Grid>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}

export default App;
