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

  const fetchedAccountList = [];

  const fetchedCategoryList = [];

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

  const deleteExpenseHandler = (
    expenseId,
    expenseAmount,
    expenseFrom,
    expenseTo
  ) => {
    const updatedExpenseLog = expenseLog.expenseList.filter(
      (expense) => expense.id !== expenseId
    );

    setExpenseLog({
      ...expenseLog,
      expenseList: updatedExpenseLog,
    });

    // delete expense from db
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses/" +
        expenseId +
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

      // update accountBalance after deleting expense
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === expenseFrom
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(expenseAmount),
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
      })

      // update categoryBalance after new expense
      .then((response) => {
        const category = fetchedCategoryList.filter(
          (category) => category.Name === expenseTo
        );
        const updatedCategory = {
          Balance: Number(category[0].Balance) - Number(expenseAmount),
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
        );
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
        deleteTransaction={deleteExpenseHandler}
      />
    </Box>
  );
};

export default Expenses;
