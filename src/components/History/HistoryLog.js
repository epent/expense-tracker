import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

import Expenses from "../../Expenses/Expenses";
import Income from "../../Income/Income";
import Transfers from "../../Transfers/Transfers";

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
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
          />
          <Income
            sliceLog={props.sliceLog}
            showIncomeLog={true}
            showIncomeForm={false}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
          />
          <Transfers
            sliceLog={props.sliceLog}
            showTransferLog={true}
            showTransferForm={false}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoryLog;
