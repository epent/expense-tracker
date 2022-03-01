import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TransactionForm from "../TransactionForm";
import TransactionList from "../TransactionList";
import ExpensesChart from "../../Charts/Bar/ExpensesChart";
import { deleteTransaction, updateTransaction } from "../../modules/fetch";

const Expenses = () => {
  const [updateExpenses, setUpdateExpenses] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [expensesToDelete, setExpensesToDelete] = useState("");

  const updateExpensesHandler = () => {
    setUpdateExpenses((prevState) => !prevState);
  };

  const deleteRowsHandler = (expensesToDelete) => {
    expensesToDelete.forEach((expenseToDelete) => {
      deleteTransaction("expense", expenseToDelete);
    });

    setShowModal(false);

    //   const triggerPageUpdate = async () => {
    //     setUpdateExpenses((prevState) => !prevState);
    //   };
    //   await triggerPageUpdate();
    // };
  };

  const editRowsHandler = (newRow, oldRow) => {
    updateTransaction("expense", oldRow, newRow);

    // const triggerPageUpdate = async () => {
    //   setUpdateExpenses((prevState) => !prevState);
    // };
    // await triggerPageUpdate();
  };

  const openModalHandler = (selectedRowsArray, transactionList) => {
    let expensesToDelete = [];
    let updatedTransactionList;

    for (let id of selectedRowsArray) {
      let filteredTransactions = transactionList.filter((transaction) => {
        return transaction.id === id;
      });
      expensesToDelete.push(...filteredTransactions);
    }

    for (let id of selectedRowsArray) {
      updatedTransactionList = transactionList.filter((transaction) => {
        return transaction.id !== id;
      });
      transactionList = updatedTransactionList;
    }

    setShowModal(true);
    setExpensesToDelete(expensesToDelete);
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
            updateExpensesHandler={updateExpensesHandler}
            paperHeight={495}
            pageTitle="Add new expense"
            addButtonColor="secondary"
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
            openModal={openModalHandler}
            closeModal={closeModalHandler}
            showModal={showModal}
            transactionsToDelete={expensesToDelete}
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
