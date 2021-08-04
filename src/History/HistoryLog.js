import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import History from "./History";

const HistoryLog = (props) => {
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

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="textSecondary">
        History
      </Typography>
      <History
        transactions={expenseLog.expenseList}
        transactionColor="secondary"
        amountColor="secondary"
        sign="-"
      />
      <History
        transactions={incomeLog.incomeList}
        transactionColor="primary"
        amountColor="primary"
        sign="+"
      />
      <History
        transactions={transferLog.transferList}
        transactionColor="textSecondary"
        amountColor="textSecondary"
        sign=""
      />
    </Box>
  );
};

export default HistoryLog;
