import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import ExpenseForm from "../Expenses/ExpenseForm";
import ExpenseLog from "../Expenses/ExpenseLog";

const Expenses = (props) => {
  const [expenseFormShow, setExpenseFormShow] = useState(false);

  const [updatedExpenseLog, setUpdatedExpenseLog] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const fetchedAccountList = [];
  const fetchedCategoryList = [];

  useEffect(() => {
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

        const accountList = fetchedAccountList.map((account) => {
          return account.Name;
        });

        setAccountList(accountList);
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

        const categoryList = fetchedCategoryList.map((category) => {
          return category.Name;
        });

        setCategoryList(categoryList);
      });
  }, [expenseFormShow]);

  const showExpenseFormHandler = () => {
    setExpenseFormShow((prevState) => !prevState);
  };

  const updateExpenseLogHandler = () => {
    setUpdatedExpenseLog((prevState) => !prevState);
  };

  const expenseForm = (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddBoxIcon />}
          onClick={showExpenseFormHandler}
        >
          Expenses
        </Button>
      </Grid>
      <Grid item xs={12}>
        {expenseFormShow && (
          <ExpenseForm
            updateExpenseLog={updateExpenseLogHandler}
            updateHomeHandler={props.updateHomeHandler}
            accountList={accountList}
            categoryList={categoryList}
          />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      {props.showExpenseForm && expenseForm}
      <Grid item xs={12}>
        {props.showExpenseLog && (
          <ExpenseLog
            sliceLog={props.sliceLog}
            updatedExpenseLog={updatedExpenseLog}
            updateExpenseLog={updateExpenseLogHandler}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Expenses;
