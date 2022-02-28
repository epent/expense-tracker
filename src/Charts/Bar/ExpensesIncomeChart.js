import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { getDataFromDBasList, getData } from "../../modules/fetch";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    width: 1550,
    height: 400,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const ExpensesIncomeChart = (props) => {
  const classes = useStyles();

  const [months, setMonths] = useState([]);

  const [expensesData, setExpensesData] = useState([]);

  const [incomeData, setIncomeData] = useState([]);

  const [updateBar, setUpdateBar] = useState(false);

  useEffect(() => {
    const updateBarChart = async () => {
      const fetchTransactions = async () => {
        const expenses = await getData("expenses");
        const incomes = await getData("incomes");

        const transactionList = [...expenses, ...incomes];

        transactionList.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const updateMonthsRowList = async () => {
          const monthsRow = [];

          transactionList.forEach((transaction) => {
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

        const updateIncomeData = async () => {
          const incomeRow = [];

          updatedMonthsRow.forEach((incomeMonth) => {
            let sumOfIncomes = 0;

            incomes.forEach((income) => {
              const fullDate = new Date(income.date);
              const [, month, ,] = fullDate.toString().split(" ");

              if (incomeMonth === month) {
                sumOfIncomes += Number(income.amount);
              }
            });

            incomeRow.push(sumOfIncomes);
          });

          setIncomeData(incomeRow);
          setUpdateBar((prevState) => !prevState);
        };
        await updateIncomeData();
      };
      await fetchTransactions();
    };
    updateBarChart();
  }, [props.updateHome]);

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Income vs Expenses
          </Typography>
        </Box>
        <BarChart
          months={[]}
          expensesData={[]}
          incomeData={[]}
          updateBar={updateBar}
          updatedMonths={months}
          updatedExpensesData={expensesData}
          updatedIncomeData={incomeData}
          colors={["#9575cd", "#26a69a"]}
        />
      </Paper>
    </Grid>
  );
};

export default ExpensesIncomeChart;
