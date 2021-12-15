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

const NewExpenses = () => {
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

        const updateBalanceInDB = () => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === expenseToDelete.From
          );
          const updatedAccount = {
            Balance:
              Number(account[0].Balance) + Number(expenseToDelete.Amount),
          };
          const accountId = account[0].id;

          patchUpdatedBalance(updatedAccount, "accounts", accountId);
        };
        updateBalanceInDB();
      };
      await updateAccountBalance();

      const updateCategoryBalance = async () => {
        const fetchedCategoryList = await getDataFromDBasList("categories");

        const updateBalanceInDB = () => {
          const category = fetchedCategoryList.filter(
            (category) => category.Name === expenseToDelete.To
          );
          const updatedCategory = {
            Balance:
              Number(category[0].Balance) - Number(expenseToDelete.Amount),
          };
          const categoryId = category[0].id;

          patchUpdatedBalance(updatedCategory, "categories", categoryId);
        };
        updateBalanceInDB();
      };
      await updateCategoryBalance();

      const updateTotalBalance = async () => {
        const fetchedTotalList = await getDataFromDBasList("total", true);

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

          await patchUpdatedTotal(updatedTotals);
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

  const editRowsHandler = (row, oldRow) => {
    let expenseForm;

    const updateTransaction = () => {
      let id;
      Object.keys(row).map((key) => {
        id = key;

        let amountString = row[key].amount.value;
        console.log(typeof amountString);
        console.log(amountString);
        let amountArray = amountString.toString().split("");
        amountArray.shift();
        let amount = amountArray.join("");

        expenseForm = {
          Amount: amount,
          From: row[key].from.value,
          To: row[key].to.value,
          Date: row[key].date.value.toDateString(),
        };
      });
      
      patchUpdatedExpenseToDB(expenseForm, "expenses", id);
    };
    updateTransaction();

    const updateData = async () => {
      const updateAmount = async () => {
        if (oldRow.Amount !== expenseForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = () => {
              const account = fetchedAccountList.filter(
                (account) => account.Name === oldRow.From
              );
              let updatedAccount;
              let accountId;

              if (oldRow.Amount > expenseForm.Amount) {
                updatedAccount = {
                  Balance:
                    Number(account[0].Balance) +
                    (Number(oldRow.Amount) - Number(expenseForm.Amount)),
                };
                accountId = account[0].id;
              }

              if (oldRow.Amount < expenseForm.Amount) {
                updatedAccount = {
                  Balance:
                    Number(account[0].Balance) -
                    (Number(expenseForm.Amount) - Number(oldRow.Amount)),
                };
                accountId = account[0].id;
              }
              patchUpdatedBalance(updatedAccount, "accounts", accountId);
            };
            updateBalanceInDB();
          };
          await updateAccountBalance();

          const updateCategoryBalance = async () => {
            const fetchedCategoryList = await getDataFromDBasList("categories");

            const updateBalanceInDB = () => {
              const category = fetchedCategoryList.filter(
                (category) => category.Name === oldRow.To
              );
              let updatedCategory;
              let categoryId;

              if (oldRow.Amount > expenseForm.Amount) {
                updatedCategory = {
                  Balance:
                    Number(category[0].Balance) -
                    (Number(oldRow.Amount) - Number(expenseForm.Amount)),
                };
                categoryId = category[0].id;
              }

              if (oldRow.Amount < expenseForm.Amount) {
                updatedCategory = {
                  Balance:
                    Number(category[0].Balance) +
                    (Number(expenseForm.Amount) - Number(oldRow.Amount)),
                };
                categoryId = category[0].id;
              }
              patchUpdatedBalance(updatedCategory, "categories", categoryId);
            };
            updateBalanceInDB();
          };
          await updateCategoryBalance();

          const updateTotalBalance = async () => {
            const fetchedTotalList = await getDataFromDBasList("total", true);

            const updateBalanceInDB = async () => {
              const totalExpenses = fetchedTotalList.filter((total) => {
                return total.id === "expenses";
              });

              const totalBalance = await calculateTotalBalance();

              let updatedTotals;

              if (oldRow.Amount < expenseForm.Amount) {
                updatedTotals = {
                  expenses:
                    Number(totalExpenses[0].expenses) -
                    (Number(expenseForm.Amount) - Number(oldRow.Amount)),
                  balance: totalBalance,
                };
              }

              if (oldRow.Amount > expenseForm.Amount) {
                updatedTotals = {
                  expenses:
                    Number(totalExpenses[0].expenses) +
                    (Number(oldRow.Amount) - Number(expenseForm.Amount)),
                  balance: totalBalance,
                };
              }

              await patchUpdatedTotal(updatedTotals);
            };
            await updateBalanceInDB();
          };
          await updateTotalBalance();
        }
      };
      await updateAmount();

      const updateAccount = async () => {
        if (oldRow.From !== expenseForm.From) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = oldRow.From)
                : (accountName = expenseForm.From);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) + Number(expenseForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) - Number(expenseForm.Amount),
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
      await updateAccount();

      const updateCategory = async () => {
        if (oldRow.To !== expenseForm.To) {
          const updateCategoryBalance = async (PrevOrCurr) => {
            const fetchedCategoryList = await getDataFromDBasList("categories");

            const updateBalanceInDB = async () => {
              let categoryName;
              PrevOrCurr === "Previous"
                ? (categoryName = oldRow.To)
                : (categoryName = expenseForm.To);

              const category = fetchedCategoryList.filter(
                (category) => category.Name === categoryName
              );
              let updatedCategory;

              PrevOrCurr === "Previous"
                ? (updatedCategory = {
                    Balance:
                      Number(category[0].Balance) - Number(expenseForm.Amount),
                  })
                : (updatedCategory = {
                    Balance:
                      Number(category[0].Balance) + Number(expenseForm.Amount),
                  });

              const categoryId = category[0].id;

              await patchUpdatedBalance(
                updatedCategory,
                "categories",
                categoryId
              );
            };
            await updateBalanceInDB();
          };
          await updateCategoryBalance("Previous");
          await updateCategoryBalance("Current");
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

export default NewExpenses;
