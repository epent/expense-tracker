import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import {
  patchUpdatedDataToDB as patchUpdatedBalance,
  patchUpdatedDataToDB as patchUpdatedTransferToDB,
  deleteTransactionFromDB,
  getDataFromDBasList,
} from "../modules/fetch";

import {
  increaseBalance as increaseAccountBalance,
  decreaseBalance as decreaseAccountBalance,
} from "../modules/deletetransaction";

import {
  editTransaction,
  updateAmountFrom,
  updateAmountTo,
  increaseBalance,
  decreaseBalance,
} from "../modules/edit";

const Transfers = (props) => {
  const [updateTransfers, setUpdateTransfers] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [transfersToDelete, setTransfersToDelete] = useState("");

  const updateTransfersHandler = () => {
    setUpdateTransfers((prevState) => !prevState);
  };

  const deleteRowsHandler = (transfersToDelete) => {
    transfersToDelete.forEach((transferToDelete) => {
      deleteTransactionFromDB("transfers", transferToDelete.id);
    });

    setShowModal(false);

    const updateData = async (transferToDelete) => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await getDataFromDBasList("accounts");

        const [updatedAccountFrom, accountIdFrom] = increaseAccountBalance(
          fetchedAccountList,
          transferToDelete
        );

        await patchUpdatedBalance(
          updatedAccountFrom,
          "accounts",
          accountIdFrom
        );

        const [updatedAccountTo, accountIdTo] = decreaseAccountBalance(
          fetchedAccountList,
          transferToDelete
        );

        await patchUpdatedBalance(updatedAccountTo, "accounts", accountIdTo);
      };
      await updateAccountBalance();

      const triggerPageUpdate = async () => {
        setUpdateTransfers((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };

    transfersToDelete.forEach((transferToDelete) =>
      updateData(transferToDelete)
    );
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

  const editRowsHandler = (row, oldRow) => {
    let transferForm;

    const updateTransaction = () => {
      const [id, form] = editTransaction(row);
      transferForm = form;

      patchUpdatedTransferToDB(transferForm, "transfers", id);
    };
    updateTransaction();

    const updateData = async () => {
      const updateAmount = async () => {
        if (oldRow.Amount !== transferForm.Amount) {
          const updateAccountBalanceFrom = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccount, accountId] = updateAmountFrom(
              fetchedAccountList,
              oldRow,
              transferForm
            );

            await patchUpdatedBalance(updatedAccount, "accounts", accountId);
          };
          await updateAccountBalanceFrom();

          const updateAccountBalanceTo = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccount, accountId] = updateAmountTo(
              fetchedAccountList,
              oldRow,
              transferForm
            );

            await patchUpdatedBalance(updatedAccount, "accounts", accountId);
          };
          await updateAccountBalanceTo();
        }
      };
      await updateAmount();

      const updateAccountFrom = async () => {
        if (oldRow.From !== transferForm.From) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccountPrevious, accountIdPrevious] = increaseBalance(
              fetchedAccountList,
              transferForm,
              oldRow,
              "From"
            );

            await patchUpdatedBalance(
              updatedAccountPrevious,
              "accounts",
              accountIdPrevious
            );

            const [updatedAccountCurrent, accountIdCurrent] = decreaseBalance(
              fetchedAccountList,
              transferForm,
              transferForm,
              "From"
            );

            await patchUpdatedBalance(
              updatedAccountCurrent,
              "accounts",
              accountIdCurrent
            );
          };
          await updateAccountBalance();
        }
      };
      await updateAccountFrom();

      const updateAccountTo = async () => {
        if (oldRow.To !== transferForm.To) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccountPrevious, accountIdPrevious] = decreaseBalance(
              fetchedAccountList,
              transferForm,
              oldRow,
              "To"
            );

            await patchUpdatedBalance(
              updatedAccountPrevious,
              "accounts",
              accountIdPrevious
            );

            const [updatedAccountCurrent, accountIdCurrent] = increaseBalance(
              fetchedAccountList,
              transferForm,
              transferForm,
              "To"
            );

            await patchUpdatedBalance(
              updatedAccountCurrent,
              "accounts",
              accountIdCurrent
            );
          };
          await updateAccountBalance();
        }
      };
      await updateAccountTo();

      const triggerPageUpdates = async () => {
        setUpdateTransfers((prevState) => !prevState);
      };
      await triggerPageUpdates();
    };
    updateData();
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
