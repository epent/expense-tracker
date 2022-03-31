import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import IncomeChart from "../../Charts/Bar/IncomeChart";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";
import { useAuth } from "../../hooks/useAuth";

const Income = (props) => {
  const auth = useAuth();

  const [updateIncome, setUpdateIncome] = useState(false);

  const updateIncomeHandler = () => {
    setUpdateIncome((prevState) => !prevState);
  };

  const deleteRowsHandler = async (incomeToDelete) => {
    const response = await deleteTransaction(
      "income",
      incomeToDelete,
      auth.token
    );

    if (response && response.statusCode) {
      props.openErrorDialog("Failed to delete income.");
    }

    setUpdateIncome((prevState) => !prevState);
  };

  const editRowsHandler = async (newRow, oldRow) => {
    const response = await updateTransaction(
      "income",
      oldRow,
      newRow,
      auth.token
    );

    if (response && response.statusCode) {
      props.openErrorDialog("Failed to update income.");
    }

    setUpdateIncome((presvState) => !presvState);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            transactionType="income"
            formColor="primary"
            updateIncomeHandler={updateIncomeHandler}
            paperHeight={495}
            pageTitle="Add new income"
            openErrorDialog={props.openErrorDialog}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            onlyIncome
            updateIncome={updateIncome}
            showDeleteButton
            deleteTransaction={deleteRowsHandler}
            editRowsHandler={editRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
            sign="+"
            allowEditing
          />
        </Grid>
        <Grid item xs={12}>
          <IncomeChart updateIncome={updateIncome} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Income;
