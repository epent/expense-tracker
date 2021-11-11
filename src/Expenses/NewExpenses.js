import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  getDataFromDB,
  deleteTransactionFromDB,
  calculateTotalBalance,
  fetchDataToList,
} from "../modules/fetch";

const NewExpenses = () => {
  const [updateExpenses, setUpdateExpenses] = useState(false);

  const updateExpensesHandler = () => {
    setUpdateExpenses((prevState) => !prevState);
  };

  const deleteRowsHandler = (selectedRowsArray, transactionList) => {
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
      deleteTransactionFromDB("expenses", id);
    }

    const updateData = async (expenseToDelete) => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await fetchDataToList("accounts");

        const updateBalanceInDB = () => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === expenseToDelete.From
          );
          const updatedAccount = {
            Balance:
              Number(account[0].Balance) + Number(expenseToDelete.Amount),
          };
          const accountId = account[0].id;

          postUpdatedBalance("accounts", accountId, updatedAccount);
        };
        updateBalanceInDB();
      };
      await updateAccountBalance();

      const updateCategoryBalance = async () => {
        const fetchedCategoryList = await fetchDataToList("categories");

        const updateBalanceInDB = () => {
          const category = fetchedCategoryList.filter(
            (category) => category.Name === expenseToDelete.To
          );
          const updatedCategory = {
            Balance:
              Number(category[0].Balance) - Number(expenseToDelete.Amount),
          };
          const categoryId = category[0].id;

          postUpdatedBalance("categories", categoryId, updatedCategory);
        };
        updateBalanceInDB();
      };
      await updateCategoryBalance();

      const updateTotalBalance = async () => {
        const fetchedTotalList = await fetchDataToList("total", true);

        const updateBalanceInDB = async () => {
          const totalExpenses = fetchedTotalList.filter((total) => {
            return total.id === "expenses";
          });

          const totalBalance = await calculateTotalBalance();

          const updatedTotals = {
            expenses:
              Number(totalExpenses[0].expenses) -
              Number(expenseToDelete.Amount),
            balance: totalBalance,
          };

          await postUpdatedTotal(updatedTotals);
        };
        await updateBalanceInDB();
      };
      await updateTotalBalance();

      const triggerPageUpdate = async () => {
        setUpdateExpenses((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };

    expensesToDelete.forEach((expenseToDelete) => updateData(expenseToDelete));
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            updateExpensesHandler={updateExpensesHandler}
            paperHeight={495}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            updateExpenses={updateExpenses}
            showDeleteButton
            deleteRowsHandler={deleteRowsHandler}
            pageSize={5}
            paperHeight={495}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewExpenses;
