import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../History/History";
import ExpenseForm from "./ExpenseForm";

const ExpenseLog = (props) => {
  const [expenseLog, setExpenseLog] = useState({
    expenseList: [],
  });

  const [expenseForm, setExpenseForm] = useState({
    From: "",
    To: "",
    Amount: "",
    Date: "",
    Comment: "",
  });

  //  id of the expense we want to edit
  const [editedExpenseId, setEditedExpenseId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
        });
      });
  }, []);

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

      // update categoryBalance after deleting expense
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

  const editExpenseHandler = (
    expenseId,
    expenseFrom,
    expenseTo,
    expenseAmount,
    expenseDate,
    expenseComment
  ) => {
    setExpenseForm({
      From: expenseFrom,
      To: expenseTo,
      Amount: expenseAmount,
      Date: expenseDate,
      Comment: expenseComment,
    });

    setEditedExpenseId(expenseId);

    if (editedExpenseId === expenseId) {
      setShowExpenseForm((prevState) => !prevState);
    }
  };

  return (
    <Box>
      <History
        transactions={expenseLog.expenseList}
        transactionColor="secondary"
        amountColor="secondary"
        sign="-"
        deleteTransaction={deleteExpenseHandler}
        editTransaction={editExpenseHandler}
        expenseForm={expenseForm}
        showExpenseForm={showExpenseForm}
        editedExpenseId={editedExpenseId}
        deleteExpenseHandler={deleteExpenseHandler}
        setShowExpenseForm={setShowExpenseForm}
      />
    </Box>
  );
};

export default ExpenseLog;
