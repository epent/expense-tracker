import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import ExpenseForm from "../Expenses/ExpenseForm";
import ExpenseLog from "../Expenses/ExpenseLog";

const Expenses = (props) => {
  const [expenseFormShow, setExpenseFormShow] = useState(false);

  const [updatedExpenseLog, setUpdatedExpenseLog] = useState(false);

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
          <ExpenseForm updateExpenseLog={updateExpenseLogHandler} />
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
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Expenses;
