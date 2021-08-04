import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Forms/Form";
import History from "./History/History";

const Income = (props) => {
  const [incomeLog, setIncomeLog] = useState({
    incomeList: [],
    loading: true,
  });

  useEffect(() => {
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
  }, []);

  const updateFormHandler = (event, formKey) => {
    props.setIncomeForm({
      ...props.incomeForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="primary">
        Income
      </Typography>
      <Form
        form={props.incomeForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.inputFormSubmitHandler}
        btnName="add income"
        btnColor="primary"
      />
      <History
        transactions={incomeLog.incomeList}
        transactionColor="primary"
        amountColor="primary"
        sign="+"
      />
    </Box>
  );
};

export default Income;
