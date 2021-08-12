import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import HistoryLog from "../History/HistoryLog";
import AccountLog from "../Accounts/AccountLog";
import CategoryLog from "../Categories/CategoryLog";

import Expenses from "./Expenses";
import Income from "./Income";
import Transfers from "./Transfers";

const Home = () => {
  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        direction="column"
        justifyContent="space-between"
        xs={3}
      >
        <Grid item>
          <Box mt={2}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Accounts
            </Typography>
            <AccountLog sliceLog={true} />
          </Box>
        </Grid>
        <Grid item>
          <Box mb={2}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Categories
            </Typography>
            <CategoryLog sliceLog={true} />
          </Box>
        </Grid>
      </Grid>
      <Grid container item direction="column" xs={6}>
        <Grid item>
          <Box my={2}>
            <Grid container item direction="row" xs={12}>
              <Grid item xs={4}>
                <Expenses showExpenseLog={false} />
              </Grid>
              <Grid item xs={4}>
                <Income showIncomeLog={false} />
              </Grid>
              <Grid item xs={4}>
                <Transfers showTransferLog={false} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={1}>
            <Grid container item direction="column" xs={12}>
              <Grid item xs={12}>
                <HistoryLog sliceLog={true} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justifyContent="space-around"
        xs={3}
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
          <Paper elevation={3}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Total expenses
            </Typography>
            <Typography variant="h5" gutterBottom color="secondary">
              10500 ILS
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
