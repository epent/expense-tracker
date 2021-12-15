import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";
import IncomeChart from "../Charts/Bar/IncomeChart";
import {
  patchUpdatedTotal,
  patchUpdatedDataToDB as patchUpdatedBalance,
  patchUpdatedDataToDB as patchUpdatedIncomeToDB,
  deleteTransactionFromDB,
  calculateTotalBalance,
  getDataFromDBasList,
} from "../modules/fetch";

const NewIncome = (props) => {
  const [updateIncome, setUpdateIncome] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState("");

  const updateIncomeHandler = () => {
    setUpdateIncome((prevState) => !prevState);
  };

  const deleteRowsHandler = (incomesToDelete) => {
    incomesToDelete.forEach((incomeToDelete) => {
      deleteTransactionFromDB("income", incomeToDelete.id);
    });

    setShowModal(false);

    const updateData = async (incomeToDelete) => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await getDataFromDBasList("accounts");

        const updateBalanceInDB = () => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === incomeToDelete.To
          );
          const updatedAccount = {
            Balance: Number(account[0].Balance) - Number(incomeToDelete.Amount),
          };
          const accountId = account[0].id;

          patchUpdatedBalance(updatedAccount, "accounts", accountId);
        };
        updateBalanceInDB();
      };
      await updateAccountBalance();

      const updateTotalBalance = async () => {
        const fetchedTotalList = await getDataFromDBasList("total", true);

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

          await patchUpdatedTotal(updatedTotals);
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

  const openModalHandler = (selectedRowsArray, transactionList) => {
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
    }

    setShowModal(true);
    setIncomeToDelete(incomesToDelete);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const editRowsHandler = (row, oldRow) => {
    let incomeForm;

    const updateTransaction = () => {
      let id;
      Object.keys(row).map((key) => {
        id = key;

        incomeForm = {
          Amount: row[key].amount.value,
          From: row[key].from.value,
          To: row[key].to.value,
          Date: row[key].date.value.toDateString(),
        };
      });
      console.log(incomeForm);
      patchUpdatedIncomeToDB(incomeForm, "income", id);
    };
    updateTransaction();

    const updateData = async () => {
      const updateAmount = async () => {
        if (oldRow.Amount !== incomeForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = () => {
              const account = fetchedAccountList.filter(
                (account) => account.Name === oldRow.To
              );

              let updatedAccount;
              let accountId;

              if (oldRow.Amount > incomeForm.Amount) {
                updatedAccount = {
                  Balance:
                    Number(account[0].Balance) -
                    (Number(oldRow.Amount) - Number(incomeForm.Amount)),
                };
                accountId = account[0].id;
              }

              if (oldRow.Amount < incomeForm.Amount) {
                console.log(oldRow.Amount);
                console.log(incomeForm.Amount);

                updatedAccount = {
                  Balance:
                    Number(account[0].Balance) +
                    (Number(incomeForm.Amount) - Number(oldRow.Amount)),
                };
                accountId = account[0].id;
              }
              patchUpdatedBalance(updatedAccount, "accounts", accountId);
            };
            updateBalanceInDB();
          };
          await updateAccountBalance();

          const updateTotalBalance = async () => {
            const fetchedTotalList = await getDataFromDBasList("total", true);

            const updateBalanceInDB = async () => {
              const totalIncome = fetchedTotalList.filter((total) => {
                return total.id === "income";
              });

              const totalBalance = await calculateTotalBalance();

              let updatedTotals;

              if (oldRow.Amount > incomeForm.Amount) {
                updatedTotals = {
                  income:
                    Number(totalIncome[0].income) -
                    (Number(oldRow.Amount) - Number(incomeForm.Amount)),
                  balace: totalBalance,
                };
              }

              if (oldRow.Amount < incomeForm.Amount) {
                updatedTotals = {
                  income:
                    Number(totalIncome[0].income) +
                    (Number(incomeForm.Amount) - Number(oldRow.Amount)),
                  balace: totalBalance,
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
        if (oldRow.To !== incomeForm.To) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await getDataFromDBasList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = oldRow.To)
                : (accountName = incomeForm.To);
              console.log(accountName);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) - Number(incomeForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) + Number(incomeForm.Amount),
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

      const triggerPageUpdates = async () => {
        setUpdateIncome((presvState) => !presvState);
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
            transactionType="income"
            updateIncomeHandler={updateIncomeHandler}
            paperHeight={495}
            pageTitle="Add new income"
            addButtonColor="primary"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList
            onlyIncome
            updateIncome={updateIncome}
            showDeleteButton
            deleteTransaction={deleteRowsHandler}
            editRowsHandler={editRowsHandler}
            pageSize={5}
            paperHeight={495}
            pageTitle="Recent transactions"
            openModal={openModalHandler}
            closeModal={closeModalHandler}
            showModal={showModal}
            transactionsToDelete={incomeToDelete}
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
