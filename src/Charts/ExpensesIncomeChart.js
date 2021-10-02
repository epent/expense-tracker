import React, { useState, useEffect } from "react";
import BarChart from "../Charts/BarChart";
import { getDataFromDB, pushFetchedDataToList } from "../modules/fetch";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 1480,
    height: 400,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const ExpensesIncomeChart = (props) => {
  const classes = useStyles();

  const [months, setMonths] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const expenses = await getDataFromDB("expenses");
      const income = await getDataFromDB("income");
      const transfers = await getDataFromDB("transfers");

      const expenseList = pushFetchedDataToList(expenses, "expenses");
      const incomeList = pushFetchedDataToList(income, "income");
      const transferList = pushFetchedDataToList(transfers, "transfers");

      const transactionList = [...expenseList, ...incomeList, ...transferList];

      const updateMonthsRowList = async () => {
        const monthsRow = [];

        transactionList.forEach((transaction) => {
          const [weekday, month, day, year] = transaction.Date.split(" ");

          if (!monthsRow.includes(month)) {
            monthsRow.push(month);
          }
        });
        setMonths(monthsRow);
      };
      await updateMonthsRowList();
    };
    fetchTransactions();
  }, []);

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Income vs Expenses
          </Typography>
        </Box>
        <BarChart
          months={[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]}
          expensesData={[
            9230, 8450, 9000, 8374, 9283, 9282, 9230, 8450, 9000, 8374, 9283,
            9282,
          ]}
          incomeData={[
            9500, 8300, 8500, 8933, 9384, 8347, 9500, 8300, 8500, 8933, 9384,
            8347,
          ]}
        />
      </Paper>
    </Grid>
  );
};

export default ExpensesIncomeChart;
