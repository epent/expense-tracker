import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
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
            <AccountLog sliceLog={true}/>
          </Box>
        </Grid>
        <Grid item>
          <Box mb={2}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Categories
            </Typography>
            <CategoryLog sliceLog={true}/>
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
          <Box my={2}>
            <Grid container item direction="column" xs={12}>
              <Grid item xs={12}>
                <HistoryLog sliceLog={true}/>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* <Grid container item direction="column" xs={3}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Accounts
          </Typography>
          <AccountLog />
        </Grid>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Categories
          </Typography>
          <CategoryLog />
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Home;
