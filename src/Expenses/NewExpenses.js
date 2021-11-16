import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import ExpensesChart from "../Charts/ExpensesChart";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  deleteTransactionFromDB,
  calculateTotalBalance,
  fetchDataToList,
  postEditedTransactionToDB,
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

  const editRowsHandler = (row, oldRow) => {
    let expenseForm;

    const updateTransaction = () => {
      let id;
      Object.keys(row).map((key) => {
        id = key;

        let amountString = row[key].amount.value;
        console.log(typeof amountString);
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
      console.log(expenseForm);
      postEditedTransactionToDB(expenseForm, "expenses", id);
    };
    updateTransaction();

    const updateData = async () => {
      const updateAmount = async () => {
        if (oldRow.Amount !== expenseForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await fetchDataToList("accounts");

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
              postUpdatedBalance("accounts", accountId, updatedAccount);
            };
            updateBalanceInDB();
          };
          await updateAccountBalance();

          const updateCategoryBalance = async () => {
            const fetchedCategoryList = await fetchDataToList("categories");

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

              await postUpdatedTotal(updatedTotals);
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
            const fetchedAccountList = await fetchDataToList("accounts");

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
              await postUpdatedBalance("accounts", accountId, updatedAccount);
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
            const fetchedCategoryList = await fetchDataToList("categories");

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

              await postUpdatedBalance(
                "categories",
                categoryId,
                updatedCategory
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

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm
            showButtonGroup={false}
            updateExpensesHandler={updateExpensesHandler}
            paperHeight={495}
            pageTitle="Add new expense"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            updateExpenses={updateExpenses}
            showDeleteButton
            deleteRowsHandler={deleteRowsHandler}
            editRowsHandler={editRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
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
