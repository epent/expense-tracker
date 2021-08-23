import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Balance from "../components/Balance/Balance";
import HistoryLog from "../components/History/HistoryLog";
import Accounts from "../Accounts/Accounts";
import Categories from "../Categories/Categories";
import Expenses from "../Expenses/Expenses";
import Income from "../Income/Income";
import Transfers from "../Transfers/Transfers";

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
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setTotal({
          ...total,
          expenses: data.expenses,
          income: data.income,
          balance: data.balance,
        });
      });
  }, [updateHome]);

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        direction="row"
        justifyContent="space-around"
        xs={12}
      >
        {/* this is not finished yet */}
        {/* <Grid item>
          <Balance
            title="Balance"
            amount={total.balance}
            amountColor="textSecondary"
          />
        </Grid> */}
        <Grid item>
          <Balance title="Income" amount={total.income} amountColor="primary" />
        </Grid>
        <Grid item>
          <Balance
            title="Expenses"
            amount={total.expenses}
            amountColor="secondary"
          />
        </Grid>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justifyContent="space-between"
        xs={3}
      >
        <Grid item>
          <Box mt={1}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Accounts
            </Typography>
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
          <Box mb={2}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Categories
            </Typography>
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
      <Grid container item direction="column" xs={6}>
        <Grid item>
          <Box mt={1}>
            <Grid item xs={12}>
              <HistoryLog
                sliceLog={true}
                updateHome={updateHome}
                updateHomeHandler={updateHomeHandler}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        xs={3}
      >
        <Grid item>
          <Box mt={8} mb={4} mr={5}>
            <Expenses
              showExpenseLog={false}
              showExpenseForm={true}
              updateHomeHandler={updateHomeHandler}
            />
          </Box>
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
