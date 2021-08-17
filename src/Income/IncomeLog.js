import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../History/History";

const IncomeLog = (props) => {
  const [incomeLog, setIncomeLog] = useState({
    incomeList: [],
  });

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

  const fetchedAccountList = [];

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        fetchedList.sort(
          (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );

        setIncomeLog({
          ...incomeLog,
          incomeList: fetchedList,
        });
      });
  }, [props.updatedIncomeLog]);

  const deleteIncomeHandler = (
    incomeId,
    incomeAmount,
    incomeFrom,
    incomeTo
  ) => {
    const updatedIncomeLog = incomeLog.incomeList.filter(
      (income) => income.id !== incomeId
    );

    setIncomeLog({
      ...incomeLog,
      incomeList: updatedIncomeLog,
    });

    // delete income from db
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/" +
        incomeId +
        ".json",
      {
        method: "DELETE",
      }
    );

    // fetch accountList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key,
          });
        }
      })

      // update accountBalance after deleting income
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === incomeTo
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(incomeAmount),
        };
        const accountId = account[0].id;

        // post changed accountBalance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      });
  };

  const editIncomeHandler = (
    incomeId,
    incomeFrom,
    incomeTo,
    incomeAmount,
    incomeDate,
    incomeComment
  ) => {
    setIncomeForm({
      From: incomeFrom,
      To: incomeTo,
      Amount: incomeAmount,
      Date: incomeDate,
      Comment: incomeComment,
    });

    setEditedIncomeId(incomeId);

    if (editedIncomeId === incomeId) {
      setShowIncomeForm((prevState) => !prevState);
    }
  };

  let transactions = incomeLog.incomeList;
  if (props.sliceLog) transactions = incomeLog.incomeList.slice(0, 2);

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
      />
    </Box>
  );
};

export default IncomeLog;
