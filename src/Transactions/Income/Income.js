import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import IncomeChart from "../../Charts/Bar/IncomeChart";

import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Income = (props) => {
  const [updateIncome, setUpdateIncome] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState("");

  const updateIncomeHandler = () => {
    setUpdateIncome((prevState) => !prevState);
  };

  const deleteRowsHandler = (incomesToDelete) => {
    incomesToDelete.forEach((incomeToDelete) => {
      deleteTransaction("income", incomeToDelete);
    });

    setShowModal(false);

    //   const triggerPageUpdate = async () => {
    //     setUpdateIncome((prevState) => !prevState);
    //   };
    //   await triggerPageUpdate();
    // };
  };

  const editRowsHandler = (newRow, oldRow) => {
    updateTransaction("income", oldRow, newRow);

    // const triggerPageUpdates = async () => {
    //   setUpdateIncome((presvState) => !presvState);
    // };
    // await triggerPageUpdates();
  };

  const openModalHandler = (transactionId, transactionList) => {
    const transactionToDelete = transactionList.filter((transaction) => {
      return transaction.id === transactionId[0];
    });

    setShowModal(true);
    setIncomeToDelete(transactionToDelete[0]);
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
            transactionType="income"
            updateIncomeHandler={updateIncomeHandler}
            paperHeight={495}
            pageTitle="Add new income"
            addButtonColor="primary"
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
            openModal={openModalHandler}
            closeModal={closeModalHandler}
            showModal={showModal}
            transactionToDelete={incomeToDelete}
            sign="+"
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
