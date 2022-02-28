import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { getData as getExpenses } from "../../modules/fetch";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 1550,
    height: 400,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const ExpensesChart = (props) => {
  const classes = useStyles();

  const [months, setMonths] = useState([]);

  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const updateBarChart = async () => {
      const fetchTransactions = async () => {
        const expenses = await getExpenses("expenses");

        expenses.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const updateMonthsRowList = async () => {
          const monthsRow = [];

          expenses.forEach((transaction) => {
            const fullDate = new Date(transaction.date);
            const [, month, ,] = fullDate.toString().split(" ");

            if (!monthsRow.includes(month)) {
              monthsRow.push(month);
            }
          });
          setMonths(monthsRow);

          return monthsRow;
        };
        const updatedMonthsRow = await updateMonthsRowList();

        const updateExpensesData = async () => {
          const expensesRow = [];

          updatedMonthsRow.forEach((expenseMonth) => {
            let sumOfExpenses = 0;

            expenses.forEach((expense) => {
              const fullDate = new Date(expense.date);
              const [, month, ,] = fullDate.toString().split(" ");

              if (expenseMonth === month) {
                sumOfExpenses += Number(expense.amount);
              }
            });

            expensesRow.push(sumOfExpenses);
          });

          setExpensesData(expensesRow);
        };
        await updateExpensesData();
      };
      await fetchTransactions();
    };
    updateBarChart();
  }, [props.updateExpenses]);

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Expenses
          </Typography>
        </Box>
        <BarChart
          months={[]}
          expensesData={[]}
          updatedMonths={months}
          updatedExpensesData={expensesData}
          colors={["#9575cd", "#26a69a"]}
        />
      </Paper>
    </Grid>
  );
};

export default ExpensesChart;
