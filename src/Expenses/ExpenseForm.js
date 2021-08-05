import React, { useState } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const ExpenseForm = () => {
  const [expenseForm, setExpenseForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: "",
    Comment: "",
  });

  const fetchedAccountList = [];

  const fetchedCategoryList = [];

  const updateFormHandler = (event, formKey) => {
    setExpenseForm({
      ...expenseForm,
      [formKey]: event.target.value,
    });
  };

  // add new expense
  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ");
    console.log(expenseForm);

    // post new expenseForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json",
      {
        method: "POST",
        body: JSON.stringify(expenseForm),
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

      // update accountBalance after new expense
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === expenseForm.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(expenseForm.Amount),
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

    // fetch categoryList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedCategoryList.push({
            ...data[key],
            id: key,
          });
        }

        console.log(fetchedCategoryList);
      })

      // update categoryBalance after new expense
      .then((response) => {
        const category = fetchedCategoryList.filter(
          (category) => category.Name === expenseForm.To
        );
        const updatedCategory = {
          Balance: Number(category[0].Balance) + Number(expenseForm.Amount),
        };
        const categoryId = category[0].id;

        // post changed categoryBalance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/" +
            categoryId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedCategory),
          }
        ).then((response) => {
          setExpenseForm({
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
        form={expenseForm}
        updateForm={updateFormHandler}
        formSubmitHandler={expenseFormSubmitHandler}
        btnName="add expense"
        btnColor="secondary"
      />
    </Box>
  );
};

export default ExpenseForm;
