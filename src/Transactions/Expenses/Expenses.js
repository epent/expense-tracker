import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import ExpensesChart from "../../Charts/Bar/ExpensesChart";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Expenses = (props) => {
  const [updateExpenses, setUpdateExpenses] = useState(false);

  const updateExpensesHandler = () => {
    setUpdateExpenses((prevState) => !prevState);
  };

  const deleteRowsHandler = async (expenseToDelete) => {
    const response = await deleteTransaction("expense", expenseToDelete);

    if (!response) {
      props.openErrorDialog("Failed to delete expense.");
    }

    setUpdateExpenses((prevState) => !prevState);
  };

  const editRowsHandler = async (newRow, oldRow) => {
    const response = await updateTransaction("expense", oldRow, newRow);

    if (!response) {
      props.openErrorDialog("Failed to update expense.");
    }

    setUpdateExpenses((prevState) => !prevState);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            transactionType="expense"
            formColor="secondary"
            updateExpensesHandler={updateExpensesHandler}
            paperHeight={495}
            pageTitle="Add new expense"
            addButtonColor="secondary"
            openErrorDialog={props.openErrorDialog}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            onlyExpenses
            updateExpenses={updateExpenses}
            showDeleteButton
            deleteTransaction={deleteRowsHandler}
            editRowsHandler={editRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
            sign="-"
            allowEditing
          />
        </Grid>
        <Grid item xs={12}>
          <ExpensesChart updateExpenses={updateExpenses} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Expenses;
