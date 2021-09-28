import React, { useState, useEffect } from "react";
import BarChart from "../Charts/BarChart";
import { getDataFromDB, pushFetchedDataToList } from "../modules/fetch";

import Box from "@material-ui/core/Box";

const ExpensesIncomeChart = (props) => {
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
    <Box>
      <BarChart
        months={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
        expensesData={[9230, 8450, 9000, 8374, 9283, 9282]}
        incomeData={[9500, 8300, 8500, 8933, 9384, 8347]}
      />
    </Box>
  );
};

export default ExpensesIncomeChart;
