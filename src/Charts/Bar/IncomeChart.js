import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { getDataFromDBasList } from "../../modules/fetch";

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

  const [updateBar, setUpdateBar] = useState(false);

  useEffect(() => {
    const updateBarChart = async () => {
      const fetchTransactions = async () => {
        const incomeList = await getDataFromDBasList("income");

        incomeList.sort(
          (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
        );

        const updateMonthsRowList = async () => {
          const monthsRow = [];

          incomeList.forEach((transaction) => {
            const [, month, ,] = transaction.Date.split(" ");

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
            let sumOfExpenses = 0;

            incomeList.forEach((income) => {
              const [, month, ,] = income.Date.split(" ");

              if (incomeMonth === month) {
                sumOfExpenses += Number(income.Amount);
              }
            });

            incomeRow.push(sumOfExpenses);
          });

          setIncomeData(incomeRow);
          console.log(incomeRow);
          setUpdateBar((prevState) => !prevState);
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
          updateBar={updateBar}
          updatedMonths={months}
          updatedIncomeData={incomeData}
          colors={["#26a69a", "#9575cd"]}
        />
      </Paper>
    </Grid>
  );
};

export default IncomeChart;
