import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../History/History";

const TransferLog = () => {
  const [transferLog, setTransferLog] = useState({
    transferList: [],
  });

  const [transferForm, setTransferForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date(),
    Comment: "",
  });

  //  id of the expense we want to edit
  const [editedTransferId, setEditedTransferId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showTransferForm, setShowTransferForm] = useState(false);

  const fetchedAccountList = [];

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json"
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

        setTransferLog({
          ...transferLog,
          transferList: fetchedList,
        });
      });
  }, []);

  const deleteTransferHandler = (
    transferId,
    transferAmount,
    transferFrom,
    transferTo
  ) => {
    const updatedTransferLog = transferLog.transferList.filter(
      (expense) => expense.id !== transferId
    );

    setTransferLog({
      ...transferLog,
      transferList: updatedTransferLog,
    });

    // delete expense from db
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers/" +
        transferId +
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

      // update accountBalanceFrom after deleting transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferTo
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(transferAmount),
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
      })

      // update accountBalanceTo after deleting transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferFrom
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(transferAmount),
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

  const editTransferHandler = (
    transferId,
    transferFrom,
    transferTo,
    transferAmount,
    transferDate,
    transferComment
  ) => {
    setTransferForm({
      From: transferFrom,
      To: transferTo,
      Amount: transferAmount,
      Date: transferDate,
      Comment: transferComment,
    });

    setEditedTransferId(transferId);

    if (editedTransferId === transferId) {
      setShowTransferForm((prevState) => !prevState);
    }
  };

  return (
    <Box>
      <History
        transactions={transferLog.transferList}
        transactionColor="textSecondary"
        amountColor="textSecondary"
        sign=""
        deleteTransaction={deleteTransferHandler}
        editTransaction={editTransferHandler}
        transferForm={transferForm}
        showTransferForm={showTransferForm}
        editedTransferId={editedTransferId}
        setShowTransferForm={setShowTransferForm}
      />
    </Box>
  );
};

export default TransferLog;
