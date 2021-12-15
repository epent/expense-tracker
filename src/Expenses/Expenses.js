import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import ExpensesChart from "../Charts/Bar/ExpensesChart";
import {
  patchUpdatedTotal,
  patchUpdatedDataToDB as patchUpdatedBalance,
  patchUpdatedDataToDB as patchUpdatedExpenseToDB,
  deleteTransactionFromDB,
  calculateTotalBalance,
  getDataFromDBasList,
} from "../modules/fetch";

import {
  increaseBalance as increaseAccountBalance,
  decreaseBalance as deacreaseCategoryBalance,
  updateTotalDelete,
} from "../modules/delete";

import {
  editTransaction,
  updateAmountFrom,
  updateAmountTo,
  increaseBalance,
  decreaseBalance,
  updateTotalEdit,
} from "../modules/edit";

const Expenses = () => {
  const [updateExpenses, setUpdateExpenses] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [expensesToDelete, setExpensesToDelete] = useState("");

  const updateExpensesHandler = () => {
    setUpdateExpenses((prevState) => !prevState);
  };

  const deleteRowsHandler = (expensesToDelete) => {
    expensesToDelete.forEach((expenseToDelete) => {
      deleteTransactionFromDB("expenses", expenseToDelete.id);
    });

    setShowModal(false);

    const updateData = async (expenseToDelete) => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await getDataFromDBasList("accounts");

        const [updatedAccount, accountId] = increaseAccountBalance(
          fetchedAccountList,
          expenseToDelete
        );

        patchUpdatedBalance(updatedAccount, "accounts", accountId);
      };
      await updateAccountBalance();

      const updateCategoryBalance = async () => {
        const fetchedCategoryList = await getDataFromDBasList("categories");

        const [updatedCategory, categoryId] = deacreaseCategoryBalance(
          fetchedCategoryList,
          expenseToDelete
        );

        patchUpdatedBalance(updatedCategory, "categories", categoryId);
      };
      await updateCategoryBalance();

      const updateTotalBalance = async () => {
        const fetchedTotalList = await getDataFromDBasList("total", true);
        const totalBalance = await calculateTotalBalance();

        const updatedTotals = updateTotalDelete(
          "expenses",
          fetchedTotalList,
          totalBalance,
          expenseToDelete
        );

        await patchUpdatedTotal(updatedTotals);
      };
      await updateTotalBalance();

      const triggerPageUpdate = async () => {
        setUpdateExpenses((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };

    expensesToDelete.forEach((expenseToDelete) => updateData(expenseToDelete));
  };

  const editRowsHandler = (row, oldRow) => {
    let expenseForm;

    const updateTransaction = () => {
      const [id, form] = editTransaction(row, "expenses");
      expenseForm = form;

      patchUpdatedExpenseToDB(expenseForm, "expenses", id);
    };
    updateTransaction();

    const updateData = async () => {
      const updateAmount = async () => {
        if (oldRow.Amount !== expenseForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccount, accountId] = updateAmountFrom(
              fetchedAccountList,
              oldRow,
              expenseForm
            );

            patchUpdatedBalance(updatedAccount, "accounts", accountId);
          };
          await updateAccountBalance();

          const updateCategoryBalance = async () => {
            const fetchedCategoryList = await getDataFromDBasList("categories");

            const [updatedCategory, categoryId] = updateAmountTo(
              fetchedCategoryList,
              oldRow,
              expenseForm
            );

            patchUpdatedBalance(updatedCategory, "categories", categoryId);
          };
          await updateCategoryBalance();

          const updateTotalBalance = async () => {
            const fetchedTotalList = await getDataFromDBasList("total", true);
            const totalBalance = await calculateTotalBalance();

            const updatedTotals = updateTotalEdit(
              "expenses",
              fetchedTotalList,
              totalBalance,
              oldRow,
              expenseForm
            );

            await patchUpdatedTotal(updatedTotals);
          };
          await updateTotalBalance();
        }
      };
      await updateAmount();

      const updateAccount = async () => {
        if (oldRow.From !== expenseForm.From) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const [updatedAccountPrevious, accountIdPrevious] = increaseBalance(
              fetchedAccountList,
              expenseForm,
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
              expenseForm,
              expenseForm,
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
      await updateAccount();

      const updateCategory = async () => {
        if (oldRow.To !== expenseForm.To) {
          const updateCategoryBalance = async (PrevOrCurr) => {
            const fetchedCategoryList = await getDataFromDBasList("categories");

            const [updatedCategoryPrevious, categoryIdPrevious] =
              decreaseBalance(fetchedCategoryList, expenseForm, oldRow, "To");

            await patchUpdatedBalance(
              updatedCategoryPrevious,
              "categories",
              categoryIdPrevious
            );

            const [updatedCategoryCurrent, categoryIdCurrent] = increaseBalance(
              fetchedCategoryList,
              expenseForm,
              expenseForm,
              "To"
            );

            await patchUpdatedBalance(
              updatedCategoryCurrent,
              "categories",
              categoryIdCurrent
            );
          };
          await updateCategoryBalance();
        }
      };
      await updateCategory();

      const triggerPageUpdate = async () => {
        setUpdateExpenses((prevState) => !prevState);
      };
      await triggerPageUpdate();
    };
    updateData();
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
