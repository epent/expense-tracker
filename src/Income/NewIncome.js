import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import IncomeChart from "../Charts/IncomeChart";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  deleteTransactionFromDB,
  calculateTotalBalance,
  fetchDataToList,
} from "../modules/fetch";

const NewIncome = (props) => {
  const [updateIncome, setUpdateIncome] = useState(false);

  const updateIncomeHandler = () => {
    setUpdateIncome((prevState) => !prevState);
  };

  const deleteRowsHandler = (selectedRowsArray, transactionList) => {
    let incomesToDelete = [];
    let updatedTransactionList;

    for (let id of selectedRowsArray) {
      let filteredTransactions = transactionList.filter((transaction) => {
        return transaction.id === id;
      });
      incomesToDelete.push(...filteredTransactions);
    }

    for (let id of selectedRowsArray) {
      updatedTransactionList = transactionList.filter((transaction) => {
        return transaction.id !== id;
      });
      transactionList = updatedTransactionList;
      deleteTransactionFromDB("income", id);
    }

    const updateData = async (incomeToDelete) => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await fetchDataToList("accounts");

        const updateBalanceInDB = () => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === incomeToDelete.To
          );
          const updatedAccount = {
            Balance: Number(account[0].Balance) - Number(incomeToDelete.Amount),
          };
          const accountId = account[0].id;

          postUpdatedBalance("accounts", accountId, updatedAccount);
        };
        updateBalanceInDB();
      };
      await updateAccountBalance();

      const updateTotalBalance = async () => {
        const fetchedTotalList = await fetchDataToList("total", true);

        const updateBalanceInDB = async () => {
          const totalIncome = fetchedTotalList.filter((total) => {
            return total.id === "income";
          });

          const totalBalance = await calculateTotalBalance();

          const updatedTotals = {
            income:
              Number(totalIncome[0].income) - Number(incomeToDelete.Amount),
            balance: totalBalance,
          };

          await postUpdatedTotal(updatedTotals);
        };
        await updateBalanceInDB();
      };
      await updateTotalBalance();

      const triggerPageUpdate = async () => {
        setUpdateIncome((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };

    incomesToDelete.forEach((incomeToDelete) => updateData(incomeToDelete));
  };

  // const editRowsHandler = (row, oldRow) => {
  //   let incomeForm;

  //   const updateTransaction = () => {
  //     let id;
  //     Object.keys(row).map((key) => {
  //       id = key;

  //       let amountString = row[key].amount.value;
  //       console.log(typeof amountString);
  //       let amountArray = amountString.toString().split("");
  //       amountArray.shift();
  //       let amount = amountArray.join("");

  //       incomeForm = {
  //         Amount: amount,
  //         From: row[key].from.value,
  //         To: row[key].to.value,
  //         Date: row[key].date.value.toDateString(),
  //       };
  //     });
  //     console.log(incomeForm);
  //     postEditedTransactionToDB(incomeForm, "income", id);
  //   };
  //   updateTransaction();

  //   const updateData = async () => {
  //     const updateAmount = async () => {
  //       if (oldRow.Amount !== incomeForm.Amount) {
  //         const updateAccountBalance = async () => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = () => {
  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === oldRow.To
  //             );

  //             let updatedAccount;
  //             let accountId;

  //             if (oldRow.Amount > incomeForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) -
  //                   (Number(props.editedIncomeForm.Amount) -
  //                     Number(incomeForm.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }

  //             if (oldRow.Amount < incomeForm.Amount) {
  //               updatedAccount = {
  //                 Balance:
  //                   Number(account[0].Balance) +
  //                   (Number(incomeForm.Amount) - Number(oldRow.Amount)),
  //               };
  //               accountId = account[0].id;
  //             }
  //             postUpdatedBalance("accounts", accountId, updatedAccount);
  //           };
  //           updateBalanceInDB();
  //         };
  //         await updateAccountBalance();

  //         const updateTotalBalance = async () => {
  //           const fetchedTotalList = await fetchDataToList("total", true);

  //           const updateBalanceInDB = async () => {
  //             const totalIncome = fetchedTotalList.filter((total) => {
  //               return total.id === "income";
  //             });

  //             const totalBalance = await calculateTotalBalance();

  //             let updatedTotals;

  //             if (oldRow.Amount > incomeForm.Amount) {
  //               updatedTotals = {
  //                 income:
  //                   Number(totalIncome[0].income) -
  //                   (Number(oldRow.Amount) - Number(incomeForm.Amount)),
  //                 balace: totalBalance,
  //               };
  //             }

  //             if (oldRow.Amount < incomeForm.Amount) {
  //               updatedTotals = {
  //                 income:
  //                   Number(totalIncome[0].income) +
  //                   (Number(incomeForm.Amount) - Number(oldRow.Amount)),
  //                 balace: totalBalance,
  //               };
  //             }
  //             await postUpdatedTotal(updatedTotals);
  //           };
  //           await updateBalanceInDB();
  //         };
  //         await updateTotalBalance();
  //       }
  //     };
  //     await updateAmount();

  //     const updateAccount = async () => {
  //       if (oldRow.To !== incomeForm.To) {
  //         const updateAccountBalance = async (PrevOrCurr) => {
  //           const fetchedAccountList = await fetchDataToList("accounts");

  //           const updateBalanceInDB = async () => {
  //             let accountName;
  //             PrevOrCurr === "Previous"
  //               ? (accountName = oldRow.To)
  //               : (accountName = incomeForm.To);

  //             const account = fetchedAccountList.filter(
  //               (account) => account.Name === accountName
  //             );
  //             let updatedAccount;

  //             PrevOrCurr === "Previous"
  //               ? (updatedAccount = {
  //                   Balance:
  //                     Number(account[0].Balance) - Number(incomeForm.Amount),
  //                 })
  //               : (updatedAccount = {
  //                   Balance:
  //                     Number(account[0].Balance) + Number(incomeForm.Amount),
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
  //     await updateAccount();

  //     const triggerPageUpdates = async () => {
  //       setUpdateIncome((presvState) => !presvState);
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
            transactionType="income"
            updateIncomeHandler={updateIncomeHandler}
            paperHeight={495}
            pageTitle="Add new income"
            addButtonColor="primary"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            updateIncome={updateIncome}
            showDeleteButton
            deleteRowsHandler={deleteRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
          />
        </Grid>
        <Grid item xs={12}>
          <IncomeChart updateIncome={updateIncome} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewIncome;
