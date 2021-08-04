import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

const HistoryLog = (props) => {
  const classes = useStyles();

  const [expenseLog, setExpenseLog] = useState({
    expenseList: [],
    loading: true,
  });

  const [incomeLog, setIncomeLog] = useState({
    incomeList: [],
    loading: true,
  });

  const [transferLog, setTransferLog] = useState({
    transferList: [],
    loading: true,
  });

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        setExpenseLog({
          ...expenseLog,
          expenseList: fetchedList,
          loading: false,
        });
      });

    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        setIncomeLog({
          ...incomeLog,
          incomeList: fetchedList,
          loading: false,
        });
      });

    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        setTransferLog({
          ...transferLog,
          transferList: fetchedList,
          loading: false,
        });
      });
  }, []);

  let fetchedExpenseList = <p>Loading...</p>;
  if (!expenseLog.loading)
    fetchedExpenseList = expenseLog.expenseList.map((expense) => {
      return (
        <Grid item key={expense.id}>
          <Card className={classes.root}>
            <CardContent>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  display="inline"
                >
                  {expense.Date}
                </Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="secondary"
                  variant="h6"
                  display="inline"
                >{`${expense.From} --> ${expense.To}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="secondary"
                  variant="h6"
                  display="inline"
                >{`- ${expense.Amount} ILS`}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body1">
                  {expense.Comment}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    });

  let fetchedIncomeList;

  if (!incomeLog.loading)
    fetchedIncomeList = incomeLog.incomeList.map((income) => {
      return (
        <Grid item key={income.id}>
          <Card className={classes.root}>
            <CardContent>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  display="inline"
                >{`${income.Date}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="primary"
                  variant="h6"
                  display="inline"
                >{`${income.From} --> ${income.To}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="primary"
                  variant="h6"
                  display="inline"
                >{`+ ${income.Amount} ILS`}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body1">
                  {income.Comment}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    });

  let fetchedTransferList;

  if (!transferLog.loading)
    fetchedTransferList = transferLog.transferList.map((transfer) => {
      return (
        <Grid item key={transfer.id}>
          <Card className={classes.root}>
            <CardContent>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  display="inline"
                >{`${transfer.Date}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  display="inline"
                >{`${transfer.From} --> ${transfer.To}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  display="inline"
                >{`${transfer.Amount} ILS`}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body1">
                  {transfer.Comment}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    });

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="textSecondary">
        History
      </Typography>
      <Grid container spacing={2}>
        {fetchedExpenseList}
      </Grid>
      <Grid container xs={12} spacing={2}>
        {fetchedIncomeList}
      </Grid>
      <Grid container spacing={2}>
        {fetchedTransferList}
      </Grid>
    </Box>
  );
};

export default HistoryLog;
