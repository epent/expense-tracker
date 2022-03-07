import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Transfers = (props) => {
  const [updateTransfers, setUpdateTransfers] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState("");

  const updateTransfersHandler = () => {
    setUpdateTransfers((prevState) => !prevState);
  };

  const deleteRowsHandler = (transfersToDelete) => {
    transfersToDelete.forEach((transferToDelete) => {
      deleteTransaction("transfer", transferToDelete);
    });

    setShowModal(false);

    //   const triggerPageUpdate = async () => {
    //     setUpdateTransfers((prevState) => !prevState);
    //   };
    //   await triggerPageUpdate();
    // };
  };

  const editRowsHandler = async (newRow, oldRow) => {
    const response = await updateTransaction("transfer", oldRow, newRow);

    if (!response) {
      props.openErrorDialog("Failed to update transfer.");
    }

    setUpdateTransfers((prevState) => !prevState);
  };

  const openModalHandler = (transactionId, transactionList) => {
    const transactionToDelete = transactionList.filter((transaction) => {
      return transaction.id === transactionId[0];
    });

    setShowModal(true);
    setTransferToDelete(transactionToDelete[0]);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            transactionType="transfer"
            updateTransfersHandler={updateTransfersHandler}
            paperHeight={495}
            pageTitle="Add new transfer"
            addButtonColor="default"
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
            openModal={openModalHandler}
            closeModal={closeModalHandler}
            showModal={showModal}
            transactionToDelete={transferToDelete}
            sign=""
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transfers;
