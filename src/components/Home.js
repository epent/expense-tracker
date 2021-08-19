import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Balance from "../Balance";
import HistoryLog from "../History/HistoryLog";
import Accounts from "./Accounts";
import Categories from "./Categories";
import Expenses from "./Expenses";
import Income from "./Income";
import Transfers from "./Transfers";

const Home = () => {
  const [updateHome, setUpdateHome] = useState(false);

  const updateHomeHandler = () => {
    setUpdateHome((prevState) => !prevState);
  };

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        direction="row"
        justifyContent="space-around"
        xs={12}
      >
        <Grid item>
          <Paper elevation={3}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Total balance
            </Typography>
            <Typography variant="h5" gutterBottom color="textSecondary">
              33500 ILS
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Total income
            </Typography>
            <Typography variant="h5" gutterBottom color="primary">
              44000 ILS
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Balance title="Expenses" amount="10000" amountColor="secondary" />
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
