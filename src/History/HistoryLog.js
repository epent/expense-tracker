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
          <ExpenseLog sliceLog={props.sliceLog} />
          <IncomeLog sliceLog={props.sliceLog} />
          <TransferLog sliceLog={props.sliceLog} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoryLog;
