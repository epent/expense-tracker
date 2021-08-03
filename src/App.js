import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import SideBar from './SideBar';
import MainContent from './MainContent';
import Expenses from './Expenses';
import Income from './Income';
import Transfers from './Transfers';
import AccountForm from './Forms/AccountForm';
import HistoryLog from './HistoryLog';


import Grid from '@material-ui/core/Grid';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#a5d6a7',
      main: '#43a047',
      dark: '#2e7d32'
    },
    secondary: {
      light: '#ce93d8',
      main: '#ab47bc',
      dark: '#2e7d32'
    },
    action: {
      active: '#ce93d8',
      hover: '#ce93d8'
    }
  }
});



function App() {
  const [expenseForm, setExpenseForm] = useState({
    From: '',
    To: '',
    Amount: 0,
    Date: '',
    Comment: ''
  });

  const [accountForm, setAccountForm] = useState({
    Name: '',
    Category: '',
    Balance: 0
  });

  const fetchedAccountList = [];

  // add new expense
  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ")
    console.log(expenseForm);

    // post new expenseForm to server
    fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json', {
      method: "POST",
      body: JSON.stringify(expenseForm)
    })

    // fetch accountList from server
    fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json')
      .then(response => response.json())
      .then(data => {

        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key
          })
        }

        console.log(fetchedAccountList);
      })

      // update accountBalance after new expense
      .then(response => {
        const account = fetchedAccountList.filter(account => account.Name === expenseForm.From);
        const updatedAccount = {
          Name: 'Bank',
          Category: 'Bank Account',
          Balance: (account[0].Balance) - (expenseForm.Amount)
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/' + accountId + '.json', {
          method: "PATCH",
          body: JSON.stringify(updatedAccount)
        })
          .then(response => {
            setExpenseForm({
              From: '',
              To: '',
              Amount: '',
              Date: '',
              Comment: ''
            });
          })
      })
  };

  const accountFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ")
    console.log(accountForm);

    fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json', {
      method: "POST",
      body: JSON.stringify(accountForm)
    })
      .then(response => {
        setAccountForm({
          Name: '',
          Category: '',
          Balance: ''
        });
      })
  };

  let routes = (
    <Switch>
      <Route path="/home" component={MainContent} />
      <Route path="/accounts">
        <AccountForm accountForm={accountForm} accountFormSubmitHandler={accountFormSubmitHandler} setAccountForm={setAccountForm} />
      </Route>
      <Route path="/expenses">
        <Expenses expenseForm={expenseForm} expenseFormSubmitHandler={expenseFormSubmitHandler} setExpenseForm={setExpenseForm} />
      </Route>
      <Route path="/income" component={Income} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/history" component={HistoryLog} />
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
