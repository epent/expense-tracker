import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { getData as getIncomes } from "../../modules/fetch";

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

const IncomeChart = (props) => {
  const classes = useStyles();

  const [months, setMonths] = useState([]);

  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    const updateBarChart = async () => {
      const fetchTransactions = async () => {
        const incomes = await getIncomes("incomes");

        incomes.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const updateMonthsRowList = async () => {
          const monthsRow = [];

          incomes.forEach((transaction) => {
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
        };
        await updateIncomeData();
      };
      await fetchTransactions();
    };
    updateBarChart();
  }, [props.updateIncome]);

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Income
          </Typography>
        </Box>
        <BarChart
          months={[]}
          incomeData={[]}
          updatedMonths={months}
          updatedIncomeData={incomeData}
          colors={["#26a69a", "#9575cd"]}
        />
      </Paper>
    </Grid>
  );
};

export default IncomeChart;
