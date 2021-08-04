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

  const fetchedAccountList = [];

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

  const deleteIncomeHandler = (incomeId, incomeAmount, incomeFrom, incomeTo) => {
    const updatedIncomeLog = incomeLog.incomeList.filter(
      (income) => income.id !== incomeId
    );

    setIncomeLog({
      ...incomeLog,
      incomeList: updatedIncomeLog,
    });

    // delete income from db
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/" +
        incomeId +
        ".json",
      {
        method: "DELETE",
      }
    );

    // fetch accountList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key,
          });
        }
      })

      // update accountBalance after deleting income
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === incomeTo
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(incomeAmount),
        };
        const accountId = account[0].id;

        // post changed accountBalance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
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
        deleteTransaction={deleteIncomeHandler}
      />
    </Box>
  );
};

export default Income;
