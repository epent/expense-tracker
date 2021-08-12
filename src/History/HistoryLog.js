import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

import ExpenseLog from "../Expenses/ExpenseLog";
import IncomeLog from "../Income/IncomeLog";
import TransferLog from "../Transfers/TransferLog";

const useStyles = makeStyles({
  root: {
    width: 530,
    backgroundColor: "#fafafa",
  },
});

const HistoryLog = () => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="textSecondary">
        History
      </Typography>
      <Card className={classes.root}>
        <CardContent>
          <ExpenseLog />
          <IncomeLog />
          <TransferLog />
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoryLog;
