import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBar from "./SideBar";
import Home from "./Home";
import Expenses from "./Expenses";
import Income from "./Income";
import Transfers from "./Transfers";
import AccountForm from "./Forms/AccountForm";
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
  const [transferForm, setTransferForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: "",
    Comment: "",
  });

  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: 0,
  });

  const fetchedAccountList = [];

  // add new transfer
  const transferFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Transfer form submitted: ");
    console.log(transferForm);

    // post new transferForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json",
      {
        method: "POST",
        body: JSON.stringify(transferForm),
      }
    );

    // fetch accountList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key,
          });
        }

        console.log(fetchedAccountList);
      })

      // update accountBalanceFrom after new transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferForm.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(transferForm.Amount),
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      })

      // update accountBalanceTo after new transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferForm.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(transferForm.Amount),
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        ).then((response) => {
          setTransferForm({
            From: "",
            To: "",
            Amount: 0,
            Date: "",
            Comment: "",
          });
        });
      });
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ");
    console.log(accountForm);

    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json",
      {
        method: "POST",
        body: JSON.stringify(accountForm),
      }
    ).then((response) => {
      setAccountForm({
        Name: "",
        Category: "",
        Balance: "",
      });
    });
  };

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
        <AccountForm
          accountForm={accountForm}
          accountFormSubmitHandler={accountFormSubmitHandler}
          setAccountForm={setAccountForm}
        />
      </Route>
      <Route path="/expenses">
        <Expenses />
      </Route>
      <Route path="/income">
        <Income />
      </Route>
      <Route path="/transfers">
        <Transfers
          transferForm={transferForm}
          transferFormSubmitHandler={transferFormSubmitHandler}
          setTransferForm={setTransferForm}
        />
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
