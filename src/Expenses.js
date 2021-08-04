import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Forms/Form";
import History from "./History/History";

const Expenses = (props) => {
  const [expenseLog, setExpenseLog] = useState({
    expenseList: [],
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
  }, []);

  const updateFormHandler = (event, formKey) => {
    props.setExpenseForm({
      ...props.expenseForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="secondary">
        Expenses
      </Typography>
      <Form
        form={props.expenseForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.expenseFormSubmitHandler}
        btnName="add expense"
        btnColor="secondary"
      />
      <History
        transactions={expenseLog.expenseList}
        transactionColor="secondary"
        amountColor="secondary"
        sign="-"
      />
    </Box>
  );
};

export default Expenses;
