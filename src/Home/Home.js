import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Balance from "../components/Balance/Balance";
import HistoryLog from "../components/History/HistoryLog";
import Accounts from "../Accounts/Accounts";
import Categories from "../Categories/Categories";
import Expenses from "../Expenses/Expenses";
import Income from "../Income/Income";
import Transfers from "../Transfers/Transfers";
import TransactionList from "../components/History/TransactionList";
import ExpensesIncomeChart from "../Charts/ExpensesIncomeChart";
import NewTransactionForm from "../components/Forms/NewTransactionForm";
import { getDataFromDB } from "../modules/fetch";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Home = () => {
  const classes = useStyles();

  const [updateHome, setUpdateHome] = useState(false);

  const [total, setTotal] = useState({
    expenses: 0,
    income: 0,
    balance: 0,
  });

  const updateHomeHandler = () => {
    setUpdateHome((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchTotals = async () => {
      const fetchedTotals = await getDataFromDB("total");

      setTotal({
        expenses: fetchedTotals.expenses,
        income: fetchedTotals.income,
        balance: fetchedTotals.balance,
      });
    };
    fetchTotals();

    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, [updateHome]);

  return (
    <div className={classes.root}>
      <Box m={3}>
        <Grid container spacing={3}>
          {/* Balances row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Balance
                  title="Balance"
                  amount={total.balance}
                  amountColor="textSecondary"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Balance
                      title="Income"
                      amount={total.income}
                      amountColor="primary"
                      sign={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Balance
                      title="Expenses"
                      amount={total.expenses}
                      amountColor="secondary"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </div>
  );
};

export default Home;
