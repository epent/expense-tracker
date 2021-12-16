import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import Balance from "./Balance/Balance";
import AccountPaper from "../AccountsCategories/Accounts/AccountPaper";
import CategoryPaper from "../AccountsCategories/Categories/CategoryPaper";
import TransactionList from "../Transactions/TransactionList";
import ExpensesIncomeChart from "../Charts/Bar/ExpensesIncomeChart";
import TransactionForm from "../Transactions/TransactionForm";
import { getDataFromDB } from "../modules/fetch";

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
  }, [updateHome]);

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
                  amount={total.balance}
                  amountColor="textSecondary"
                  route="/accounts"
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
                      route="/income"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Balance
                      title="Expenses"
                      amount={total.expenses}
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
