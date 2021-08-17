import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import ExpenseForm from "../Expenses/ExpenseForm";
import ExpenseLog from "../Expenses/ExpenseLog";

const Expenses = (props) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [updatedExpenseLog, setUpdatedExpenseLog] = useState(false);

  const showExpenseFormHandler = () => {
    setShowExpenseForm((prevState) => !prevState);
  };

  const updateExpenseLogHandler = () => {
    setUpdatedExpenseLog((prevState) => !prevState);
  };

  return (
    <Grid container>
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
        {showExpenseForm && (
          <ExpenseForm updateExpenseLog={updateExpenseLogHandler} />
        )}
      </Grid>
      <Grid item xs={12}>
        {props.showExpenseLog && (
          <ExpenseLog
            updatedExpenseLog={updatedExpenseLog}
            updateExpenseLog={updateExpenseLogHandler}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Expenses;
