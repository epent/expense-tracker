import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import Balance from "../components/Balance/Balance";
import HistoryLog from "../components/History/HistoryLog";
import Accounts from "../Accounts/Accounts";
import Categories from "../Categories/Categories";
import Expenses from "../Expenses/Expenses";
import Income from "../Income/Income";
import Transfers from "../Transfers/Transfers";
import TransactionList from "../components/History/TransactionList";
import ExpensesIncomeChart from "../Charts/ExpensesIncomeChart";
import { getDataFromDB } from "../modules/fetch";

const Home = () => {
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
    <Grid container spacing={3}>
      <Grid
        container
        item
        direction="row"
        justifyContent="space-between"
        xs={12}
      >
        <Grid item>
          <Box mt={3}>
            <Balance
              title="Balance"
              amount={total.balance}
              amountColor="textSecondary"
            />
          </Box>
        </Grid>
        <Grid item>
          <Box mt={3}>
            <Balance
              title="Income"
              amount={total.income}
              amountColor="primary"
            />
          </Box>
        </Grid>
        <Grid item>
          <Box mt={3}>
            <Balance
              title="Expenses"
              amount={total.expenses}
              amountColor="secondary"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        item
        direction="row"
        justifyContent="space-between"
        xs={12}
      >
        <Grid item>
          <Box mt={3}>
            <TransactionList updateHome={updateHome} />
          </Box>
        </Grid>
        <Grid item>
          <Expenses
            showExpenseLog={false}
            showExpenseForm={true}
            updateHomeHandler={updateHomeHandler}
          />
        </Grid>
        {/* <Grid item>
            <Box my={4} mr={5}>
              <Income
                showIncomeLog={false}
                showIncomeForm={true}
                updateHomeHandler={updateHomeHandler}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box my={4} mr={5}>
              <Transfers
                showTransferLog={false}
                showTransferForm={true}
                updateHomeHandler={updateHomeHandler}
              />
            </Box>
          </Grid> */}
      </Grid>
      <Grid
        container
        item
        direction="row"
        justifyContent="space-between"
        xs={12}
        spacing={3}
      >
        <Grid item>
          <Box mt={3}>
            <Accounts
              sliceLog={true}
              showAccountForm={false}
              showEditBtn={false}
              showDeleteBtn={false}
              updateHome={updateHome}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box mt={3}>
            <Categories
              sliceLog={true}
              showCategoryForm={false}
              showEditBtn={false}
              showDeleteBtn={false}
              updateHome={updateHome}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Box mt={3} mb={3}>
          <ExpensesIncomeChart />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
