import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Expenses from "../../Expenses/Expenses";
import Income from "../../Income/Income";
import Transfers from "../../Transfers/Transfers";

const useStyles = makeStyles({
  root: {
    width: 830,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const HistoryLog = (props) => {
  const classes = useStyles();

  return (
    <Box mx={2}>
      <Grid container>
        <Paper elevation={3} className={classes.root}>
          <Box mt={3} mx={3}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              Transactions
            </Typography>
          </Box>
          <Box px={3} my={3}>
            <Expenses showExpenseLog={true} showExpenseForm={false} />
            <Income showIncomeLog={true} showIncomeForm={false} />
            <Transfers showTransferLog={true} showTransferForm={false} />
          </Box>
        </Paper>
      </Grid>
    </Box>
  );
};

export default HistoryLog;
