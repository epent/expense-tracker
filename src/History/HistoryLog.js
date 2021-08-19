import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

import ExpenseLog from "../Expenses/ExpenseLog";
import IncomeLog from "../Income/IncomeLog";
import TransferLog from "../Transfers/TransferLog";

import Expenses from "../components/Expenses";
import Income from "../components/Income";
import Transfers from "../components/Transfers";

const useStyles = makeStyles({
  root: {
    width: 530,
    backgroundColor: "#fafafa",
  },
});

const HistoryLog = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          History
        </Typography>
      </Box>
      <Card className={classes.root}>
        <CardContent>
          <Expenses
            sliceLog={props.sliceLog}
            showExpenseLog={true}
            showExpenseForm={false}
          />
          <Income
            sliceLog={props.sliceLog}
            showIncomeLog={true}
            showIncomeForm={false}
          />
          <Transfers
            sliceLog={props.sliceLog}
            showTransferLog={true}
            showTransferForm={false}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoryLog;
