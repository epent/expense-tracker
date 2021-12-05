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

const NewIncome = () => {
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
          <IncomeChart updateIncome={updateIncome}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewIncome;
