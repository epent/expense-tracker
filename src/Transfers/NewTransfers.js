import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import {
  postUpdatedBalance,
  deleteTransactionFromDB,
  fetchDataToList,
} from "../modules/fetch";

const NewTransfers = () => {
  const [updateTransfers, setUpdateTransfers] = useState(false);

  const updateTransfersHandler = () => {
    setUpdateTransfers((prevState) => !prevState);
  };

  const deleteRowsHandler = (selectedRowsArray, transactionList) => {
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
      deleteTransactionFromDB("transfers", id);
    }

    const updateData = async (transferToDelete) => {
      const updateAccountBalance = async (fromOrTo) => {
        const fetchedAccountList = await fetchDataToList("accounts");

        const updateBalanceInDB = async () => {
          let accountName;
          fromOrTo === "From"
            ? (accountName = transferToDelete.From)
            : (accountName = transferToDelete.To);

          const account = fetchedAccountList.filter(
            (account) => account.Name === accountName
          );

          let updatedAccount;
          fromOrTo === "From"
            ? (updatedAccount = {
                Balance:
                  Number(account[0].Balance) + Number(transferToDelete.Amount),
              })
            : (updatedAccount = {
                Balance:
                  Number(account[0].Balance) - Number(transferToDelete.Amount),
              });
          const accountId = account[0].id;

          await postUpdatedBalance("accounts", accountId, updatedAccount);
        };
        await updateBalanceInDB();
      };
      await updateAccountBalance("From");
      await updateAccountBalance("To");

      const triggerPageUpdate = async () => {
        setUpdateTransfers((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };

    transfersToDelete.forEach((transferToDelete) =>
      updateData(transferToDelete)
    );
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
            updateTransfers={updateTransfers}
            showDeleteButton
            deleteRowsHandler={deleteRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewTransfers;
