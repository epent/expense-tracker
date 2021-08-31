import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";

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

  const pushFetchedDataToList = (data) => {
    const list = [];
    if (data) {
      Object.keys(data).map((key) => {
        list.push({
          ...data[key],
          id: key,
        });
      });
    }
    return list;
  };

  useEffect(() => {
    const fetchIncomeLog = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);
      fetchedDataList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setIncomeLog(fetchedDataList);
    };
    fetchIncomeLog();
  }, [props.updatedIncomeLog, props.updateHome]);

  const deleteIncomeHandler = (incometoDelete) => {
    const updateIncomeLog = () => {
      const updatedIncomeLog = incomeLog.filter(
        (income) => income.id !== incometoDelete.id
      );
      setIncomeLog(updatedIncomeLog);
    };
    updateIncomeLog();

    // close the delete modal
    setShowModal(false);

    // delete income from db
    const deleteIncomeFromDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/${incometoDelete.id}.json`,
        {
          method: "DELETE",
        }
      );
    };
    deleteIncomeFromDB();

    // fetch accountList from server
    const updateAccountBalance = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);

      const updateBalanceInDB = () => {
        const account = fetchedDataList.filter(
          (account) => account.Name === incometoDelete.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(incometoDelete.Amount),
        };
        const accountId = account[0].id;

        fetch(
          `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/${accountId}.json`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        ).then((response) => {
          if (props.updateHomeHandler) props.updateHomeHandler();
        });
      };
      updateBalanceInDB();
    };
    updateAccountBalance();

    // fetch totalBalances from server
    const updateTotalBalance = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
      );
      const fetchedData = response.json();
      const pushFetchedBalanceToList = (data) => {
        const list = [];
        if (data) {
          for (let index in data) {
            list.push({
              [index]: data[index],
              id: index,
            });
          }
        }
        return list;
      };
      const fetchedDataList = pushFetchedBalanceToList(fetchedData);

      const updateBalanceInDB = () => {
        const totalIncome = fetchedDataList.filter((total) => {
          return total.id === "income";
        });

        const updatedTotals = {
          income: Number(totalIncome[0].income) - Number(incometoDelete.Amount),
        };

        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedTotals),
          }
        );
      };
      updateBalanceInDB();
    };
    updateTotalBalance();
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

  let transactions = incomeLog;
  if (props.sliceLog) transactions = incomeLog.slice(0, 2);

  return (
    <Box>
      <History
        transactions={transactions}
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
        updateHomeHandler={props.updateHomeHandler}
        accountList={props.accountList}
        categoryList={props.categoryList}
      />
    </Box>
  );
};

export default IncomeLog;
