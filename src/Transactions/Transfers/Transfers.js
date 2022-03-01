import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Transfers = (props) => {
  const [updateTransfers, setUpdateTransfers] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [transfersToDelete, setTransfersToDelete] = useState("");

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

  const editRowsHandler = (newRow, oldRow) => {
    updateTransaction("transfer", oldRow, newRow);

    // const triggerPageUpdates = async () => {
    //   setUpdateTransfers((prevState) => !prevState);
    // };
    // await triggerPageUpdates();
  };

  const openModalHandler = (selectedRowsArray, transactionList) => {
    let transfersToDelete = [];
    let updatedTransactionList;

    for (let id of selectedRowsArray) {
      let filteredTransactions = transactionList.filter((transaction) => {
        return transaction.id === id;
      });
      transfersToDelete.push(...filteredTransactions);
    }

    for (let id of selectedRowsArray) {
      updatedTransactionList = transactionList.filter((transaction) => {
        return transaction.id !== id;
      });
      transactionList = updatedTransactionList;
    }

    setShowModal(true);
    setTransfersToDelete(transfersToDelete);
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
            transactionsToDelete={transfersToDelete}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transfers;
