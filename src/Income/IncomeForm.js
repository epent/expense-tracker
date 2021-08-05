import React, { useState } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const IncomeForm = () => {
  const [incomeForm, setIncomeForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: "",
    Comment: "",
  });

  const fetchedAccountList = [];

  const updateFormHandler = (event, formKey) => {
    setIncomeForm({
      ...incomeForm,
      [formKey]: event.target.value,
    });
  };

  // add new income
  const incomeFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Income form submitted: ");
    console.log(incomeForm);

    // post new incomeForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json",
      {
        method: "POST",
        body: JSON.stringify(incomeForm),
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

        console.log(fetchedAccountList);
      })

      // update accountBalance after new income
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === incomeForm.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(incomeForm.Amount),
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        ).then((response) => {
          setIncomeForm({
            From: "",
            To: "",
            Amount: 0,
            Date: "",
            Comment: "",
          });
        });
      });
  };

  return (
    <Box>
      <Form
        form={incomeForm}
        updateForm={updateFormHandler}
        formSubmitHandler={incomeFormSubmitHandler}
        btnName="add income"
        btnColor="primary"
      />
    </Box>
  );
};

export default IncomeForm;
