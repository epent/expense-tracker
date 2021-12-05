import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import {
  postUpdatedBalance,
  deleteTransactionFromDB,
  fetchDataToList,
  postEditedTransactionToDB,
} from "../modules/fetch";

const NewTransfers = (props) => {
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

  // const editRowsHandler = (row, oldRow) => {
  //   let transferForm;

  //   const updateTransaction = () => {
  //     let id;
  //     Object.keys(row).map((key) => {
  //       id = key;

  //       let amountString = row[key].amount.value;
  //       console.log(typeof amountString);
  //       let amountArray = amountString.toString().split("");
  //       amountArray.shift();
  //       let amount = amountArray.join("");

  //       transferForm = {
  //         Amount: amount,
  //         From: row[key].from.value,
  //         To: row[key].to.value,
  //         Date: row[key].date.value.toDateString(),
  //       };
  //     });
  //     console.log(transferForm);
  //     postEditedTransactionToDB(transferForm, "transfers", id);
  //   };
  //   updateTransaction();

  //   const updateData = async () => {
  //     const updateAccountFrom = async () => {
  //       if (oldRow.From !== transferForm.From) {
  //         const updateAccountBalance = async (PrevOrCurr) => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = async () => {
  //             let accountName;
  //             PrevOrCurr === "Previous"
  //               ? (accountName = oldRow.From)
  //               : (accountName = transferForm.From);

  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === accountName
  //             );
  //             let updatedAccount;

  //             PrevOrCurr === "Previous"
  //               ? (updatedAccount = {
  //                   Balance: Number(account[0].Balance) + Number(oldRow.Amount),
  //                 })
  //               : (updatedAccount = {
  //                   Balance: Number(account[0].Balance) - Number(oldRow.Amount),
  //                 });

  //             const accountId = account[0].id;
  //             await postUpdatedBalance("accounts", accountId, updatedAccount);
  //           };
  //           await updateBalanceInDB();
  //         };
  //         await updateAccountBalance("Previous");
  //         await updateAccountBalance("Current");
  //       }
  //     };
  //     await updateAccountFrom();

  //     const updateAccountTo = async () => {
  //       if (oldRow.To !== transferForm.To) {
  //         const updateAccountBalance = async (PrevOrCurr) => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = async () => {
  //             let accountName;
  //             PrevOrCurr === "Previous"
  //               ? (accountName = oldRow.To)
  //               : (accountName = transferForm.To);

  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === accountName
  //             );
  //             let updatedAccount;

  //             PrevOrCurr === "Previous"
  //               ? (updatedAccount = {
  //                   Balance: Number(account[0].Balance) - Number(oldRow.Amount),
  //                 })
  //               : (updatedAccount = {
  //                   Balance: Number(account[0].Balance) + Number(oldRow.Amount),
  //                 });

  //             const accountId = account[0].id;
  //             await postUpdatedBalance("accounts", accountId, updatedAccount);
  //           };
  //           await updateBalanceInDB();
  //         };
  //         await updateAccountBalance("Previous");
  //         await updateAccountBalance("Current");
  //       }
  //     };
  //     await updateAccountTo();

  //     const updateAmount = async () => {
  //       if (oldRow.Amount !== transferForm.Amount) {
  //         const updateAccountBalanceFrom = async () => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = async () => {
  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === transferForm.From
  //             );

  //             let updatedAccount;
  //             let accountId;

  //             if (oldRow.Amount > transferForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) +
  //                   (Number(oldRow.Amount) - Number(transferForm.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }

  //             if (oldRow.Amount < transferForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) -
  //                   (Number(transferForm.Amount) - Number(oldRow.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }
  //             await postUpdatedBalance("accounts", accountId, updatedAccount);
  //           };
  //           await updateBalanceInDB();
  //         };
  //         await updateAccountBalanceFrom();

  //         const updateAccountBalanceTo = async () => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = async () => {
  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === transferForm.To
  //             );

  //             let updatedAccount;
  //             let accountId;

  //             if (oldRow.Amount > transferForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) -
  //                   (Number(oldRow.Amount) - Number(transferForm.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }

  //             if (oldRow.Amount < transferForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) +
  //                   (Number(transferForm.Amount) - Number(oldRow.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }
  //             await postUpdatedBalance("accounts", accountId, updatedAccount);
  //           };
  //           await updateBalanceInDB();
  //         };
  //         await updateAccountBalanceTo();
  //       }
  //     };
  //     await updateAmount();

  //     const triggerPageUpdates = async () => {
  //       setUpdateTransfers((prevState) => !prevState);
  //     };
  //     await triggerPageUpdates();
  //   };
  //   updateData();
  // };

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
