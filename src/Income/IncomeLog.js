import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  getDataFromDB,
  deleteTransactionFromDB,
  calculateTotalBalance,
  fetchDataToList
} from "../modules/fetch";

const IncomeLog = (props) => {
  const [incomeLog, setIncomeLog] = useState([]);

  const [incomeForm, setIncomeForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date(),
    Comment: "",
  });

  //  id of the expense we want to edit
  const [editedIncomeId, setEditedIncomeId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  // needed for modal when deleting transaction
  const [showModal, setShowModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState("");

  useEffect(() => {
    const fetchIncomeLog = async () => {
      const fetchedIncomeList = await fetchDataToList("income");
      fetchedIncomeList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setIncomeLog(fetchedIncomeList);
    };
    fetchIncomeLog();
  }, [props.updatedIncomeLog]);

  const deleteIncomeHandler = (incometoDelete) => {
    deleteTransactionFromDB("income", incometoDelete.id);

    const updateIncomeLog = () => {
      const updatedIncomeLog = incomeLog.filter(
        (income) => income.id !== incometoDelete.id
      );
      setIncomeLog(updatedIncomeLog);
    };
    updateIncomeLog();

    // close the delete modal
    setShowModal(false);

    const updateData = async () => {
      const updateAccountBalance = async () => {
        const fetchedAccountList = await fetchDataToList("accounts");

        const updateBalanceInDB = () => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === incometoDelete.To
          );
          const updatedAccount = {
            Balance: Number(account[0].Balance) - Number(incometoDelete.Amount),
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
              Number(totalIncome[0].income) - Number(incometoDelete.Amount),
            balance: totalBalance,
          };

          await postUpdatedTotal(updatedTotals);
        };
        await updateBalanceInDB();
      };
      await updateTotalBalance();
    };
    updateData();
  };

  const editIncomeHandler = (income) => {
    setIncomeForm({
      From: income.From,
      To: income.To,
      Amount: income.Amount,
      Date: income.Date,
      Comment: income.Comment,
    });

    setEditedIncomeId(income.id);

    if (editedIncomeId === income.id) {
      setShowIncomeForm((prevState) => !prevState);
      props.setEditIncomeFormShow();
    }
  };

  const openModalHandler = (transaction) => {
    setShowModal(true);
    setIncomeToDelete(transaction);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <Box>
      <History
        transactions={incomeLog}
        transactionColor="primary"
        arrowColor="primary"
        amountColor="primary"
        sign="+"
        deleteTransaction={deleteIncomeHandler}
        editTransaction={editIncomeHandler}
        incomeForm={incomeForm}
        showIncomeForm={showIncomeForm}
        editedIncomeId={editedIncomeId}
        setShowIncomeForm={setShowIncomeForm}
        updateIncomeLog={props.updateIncomeLog}
        openModal={openModalHandler}
        closeModal={closeModalHandler}
        showModal={showModal}
        transactionToDelete={incomeToDelete}
        accountList={props.accountList}
      />
    </Box>
  );
};

export default IncomeLog;
