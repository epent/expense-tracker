import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";

const TransferLog = (props) => {
  const [transferLog, setTransferLog] = useState([]);

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

  // needed for modal when deleting transaction
  const [showModal, setShowModal] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState("");

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

        fetchedList.sort(
          (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );

        setTransferLog(fetchedList);
      });
  }, [props.updatedTransferLog, props.updateHome]);

  const deleteTransferHandler = (transferToDelete) => {
    const updatedTransferLog = transferLog.filter(
      (expense) => expense.id !== transferToDelete.id
    );

    setTransferLog(updatedTransferLog);

    setShowModal(false);

    // delete expense from db
    fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers/${transferToDelete.id}.json`,
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
          (account) => account.Name === transferToDelete.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(transferToDelete.Amount),
        };
        const accountId = account[0].id;

        // post changed accountBalance to server
        fetch(
          `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/${accountId}.json`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      })

      // update accountBalanceTo after deleting transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferToDelete.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(transferToDelete.Amount),
        };
        const accountId = account[0].id;

        // post changed accountBalance to server
        fetch(
          `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/${accountId}.json`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        )
          // trigger Home to rerender with updated accountLog/categoryLog
          .then((response) => {
            if (props.updateHomeHandler) props.updateHomeHandler();
          });
      });
  };

  const editTransferHandler = (transfer) => {
    setTransferForm({
      From: transfer.From,
      To: transfer.To,
      Amount: transfer.Amount,
      Date: transfer.Date,
      Comment: transfer.Comment,
    });

    setEditedTransferId(transfer.id);

    if (editedTransferId === transfer.id) {
      setShowTransferForm((prevState) => !prevState);
    }
  };

  const openModalHandler = (transaction) => {
    setShowModal(true);
    setTransferToDelete(transaction);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  let transactions = transferLog;
  if (props.sliceLog) transactions = transferLog.slice(0, 2);

  return (
    <Box>
      <History
        transactions={transactions}
        transactionColor="textSecondary"
        arrowColor="disabled"
        amountColor="textSecondary"
        sign=""
        deleteTransaction={deleteTransferHandler}
        editTransaction={editTransferHandler}
        transferForm={transferForm}
        showTransferForm={showTransferForm}
        editedTransferId={editedTransferId}
        setShowTransferForm={setShowTransferForm}
        updateTransferLog={props.updateTransferLog}
        openModal={openModalHandler}
        closeModal={closeModalHandler}
        showModal={showModal}
        transactionToDelete={transferToDelete}
        updateHomeHandler={props.updateHomeHandler}
        accountList={props.accountList}
        categoryList={props.categoryList}
      />
    </Box>
  );
};

export default TransferLog;
