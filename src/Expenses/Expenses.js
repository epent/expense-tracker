import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import ExpenseForm from "./ExpenseForm";
import ExpenseLog from "./ExpenseLog";
import { fetchAccountsFromDB, fetchCategoriesFromDB } from "../modules/fetch";

const Expenses = (props) => {
  const [expenseFormShow, setExpenseFormShow] = useState(false);

  const [editExpenseFormShow, setEditExpenseFormShow] = useState(false);

  const [updatedExpenseLog, setUpdatedExpenseLog] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();
      const accountList = fetchedAccountList.map((account) => {
        return account.Name;
      });

      setAccountList(accountList);
    };
    fetchAccounts();

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const fetchedCategoryList = await fetchCategoriesFromDB();
      const categoryList = fetchedCategoryList.map((category) => {
        return category.Name;
      });

      setCategoryList(categoryList);
    };
    fetchCategories();
  }, [expenseFormShow, editExpenseFormShow]);

  // show the form when toggle "+Expenses" button
  const showExpenseFormHandler = () => {
    setExpenseFormShow((prevState) => !prevState);
  };

  // trigger fetch of acocunts and categories (useEffect) for the edit form
  const editExpenseFormShowHandler = () => {
    setEditExpenseFormShow((prevState) => !prevState);
  };

  // update the list of expenses
  const updateExpenseLogHandler = () => {
    setUpdatedExpenseLog((prevState) => !prevState);
  };

  const expenseForm = (
    <Box mt={3}>
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
    </Box>
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
            setEditExpenseFormShow={editExpenseFormShowHandler}
            accountList={accountList}
            categoryList={categoryList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Expenses;
