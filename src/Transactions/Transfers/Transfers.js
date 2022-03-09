import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Transfers = (props) => {
  const [updateTransfers, setUpdateTransfers] = useState(false);

  const updateTransfersHandler = () => {
    setUpdateTransfers((prevState) => !prevState);
  };

  const deleteRowsHandler = async (transferToDelete) => {
    const response = await deleteTransaction("transfer", transferToDelete);

    if (!response) {
      props.openErrorDialog("Failed to delete transfer.");
    }

    setUpdateTransfers((prevState) => !prevState);
  };

  const editRowsHandler = async (newRow, oldRow) => {
    const response = await updateTransaction("transfer", oldRow, newRow);

    if (!response) {
      props.openErrorDialog("Failed to update transfer.");
    }

    setUpdateTransfers((prevState) => !prevState);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            transactionType="transfer"
            formColor="transfer"
            updateTransfersHandler={updateTransfersHandler}
            paperHeight={495}
            pageTitle="Add new transfer"
            addButtonColor="transfer"
            openErrorDialog={props.openErrorDialog}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            onlyTransfers
            updateTransfers={updateTransfers}
            showDeleteButton
            deleteTransaction={deleteRowsHandler}
            editRowsHandler={editRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
            sign=""
            allowEditing
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transfers;
