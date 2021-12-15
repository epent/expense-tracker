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
  updatedBalanceFrom,
  updatedBalanceTo,
} from "../modules/edittrasaction";

const NewTransfers = (props) => {
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

            const [updatedAccount, accountId] = updatedBalanceFrom(
              fetchedAccountList,
              oldRow,
              transferForm
            );

            await patchUpdatedBalance(updatedAccount, "accounts", accountId);
          };
          await updateAccountBalanceFrom();

          const updateAccountBalanceTo = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccount, accountId] = updatedBalanceTo(
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
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = oldRow.From)
                : (accountName = transferForm.From);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance: Number(account[0].Balance) + Number(oldRow.Amount),
                  })
                : (updatedAccount = {
                    Balance: Number(account[0].Balance) - Number(oldRow.Amount),
                  });

              const accountId = account[0].id;
              await patchUpdatedBalance(updatedAccount, "accounts", accountId);
            };
            await updateBalanceInDB();
          };
          await updateAccountBalance("Previous");
          await updateAccountBalance("Current");
        }
      };
      await updateAccountFrom();

      const updateAccountTo = async () => {
        if (oldRow.To !== transferForm.To) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = oldRow.To)
                : (accountName = transferForm.To);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance: Number(account[0].Balance) - Number(oldRow.Amount),
                  })
                : (updatedAccount = {
                    Balance: Number(account[0].Balance) + Number(oldRow.Amount),
                  });

              const accountId = account[0].id;
              await patchUpdatedBalance(updatedAccount, "accounts", accountId);
            };
            await updateBalanceInDB();
          };
          await updateAccountBalance("Previous");
          await updateAccountBalance("Current");
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

export default NewTransfers;
