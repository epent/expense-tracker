import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import Balance from "./Balance/Balance";
import AccountPaper from "../AccountsCategories/Accounts/AccountPaper";
import CategoryPaper from "../AccountsCategories/Categories/CategoryPaper";
import TransactionList from "../Transactions/TransactionList";
import ExpensesIncomeChart from "../Charts/Bar/ExpensesIncomeChart";
import TransactionForm from "../Transactions/TransactionForm";
import { getData as getBalances } from "../modules/fetch";
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Home = (props) => {
  const classes = useStyles();

  const auth = useAuth();

  const [updateHome, setUpdateHome] = useState(false);

  const [balances, setBalances] = useState({
    expenses: 0,
    income: 0,
    total: 0,
  });

  const updateHomeHandler = () => {
    setUpdateHome((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchTotals = async () => {
      const balances = await getBalances("balances", auth.token);

      setBalances({
        total: balances.total,
        income: balances.income,
        expenses: balances.expenses,
      });
    };
    if (auth.token) {
      fetchTotals();
    }
  }, [updateHome, auth.token]);

  return (
    <div className={classes.root}>
      <Box>
        <Grid container spacing={3}>
          {/* Balances row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Balance
                  title="Balance"
                  amount={balances.total}
                  amountColor="textSecondary"
                  route="/accounts"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Balance
                      title="Income"
                      amount={balances.income}
                      amountColor="primary"
                      sign={true}
                      route="/income"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Balance
                      title="Expenses"
                      amount={balances.expenses}
                      amountColor="secondary"
                      route="/expenses"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Transactions + Form row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6}>
                <TransactionForm
                  updateHomeHandler={updateHomeHandler}
                  showButtonGroup
                  paperHeight={533}
                  pageTitle="Add new transaction"
                  addButtonColor="secondary"
                  openErrorDialog={props.openErrorDialog}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TransactionList
                  updateHome={updateHome}
                  paperHeight={533}
                  pageSize={7}
                  pageTitle="Recent transactions"
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Accounts + Categories row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <AccountPaper
                  sliceLog={true}
                  showEditBtn={false}
                  showDeleteBtn={false}
                  updateHome={updateHome}
                  title="Accounts"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CategoryPaper
                  sliceLog={true}
                  showEditBtn={false}
                  showDeleteBtn={false}
                  updateHome={updateHome}
                  title="Categories"
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Income vs Expenses row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ExpensesIncomeChart updateHome={updateHome} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Home;
