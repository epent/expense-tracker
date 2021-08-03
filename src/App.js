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
  const [expenses, setExpenses] = useState({
    expenseForm: {
      From: '',
      To: '',
      Amount: '',
      Date: '',
      Comment: ''
    },
    expenseList: []
  });

  const [accountForm, setAccountForm] = useState({
    Name: '',
    Category: '',
    Balance: ''
  });


  const addExpenseHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ")
    console.log(expenses);

    fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json', {
      method: "POST",
      body: JSON.stringify(expenses.expenseForm)
    })
      .then(response => {
        const currentExpenseList = [...expenses.expenseList];
        currentExpenseList.push(expenses.expenseForm);

        setExpenses({
          ...expenses,
          expenseForm: {
            From: '',
            To: '',
            Amount: '',
            Date: '',
            Comment: ''
          }
        });
      })

    fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json')
      .then(response => response.json())
      .then(data => {
        const fetchedExpenseList = [];
        for (let key in data) {
          fetchedExpenseList.push({
            ...data[key],
            id: key
          })
        }

        setExpenses({
          ...expenses,
          expenseList: fetchedExpenseList
        });
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
        const currentAccounts = [...accountForm];
        console.log(currentAccounts)

        currentAccounts.push(accountForm);
        console.log(currentAccounts)

        setAccountForm(...accountForm, currentAccounts);
        console.log(accountForm)

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
        <Expenses expenseForm={expenses.expenseForm} expenseFormSubmitHandler={addExpenseHandler} setExpenseForm={setExpenses} />
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
