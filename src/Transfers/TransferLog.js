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

  // needed for modal when deleting transaction
  const [showModal, setShowModal] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState("");

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
    const fetchTransferLog = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json"
      );

      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);
      fetchedDataList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setTransferLog(fetchedDataList);
    };
    fetchTransferLog();
  }, [props.updatedTransferLog, props.updateHome]);

  const deleteTransferHandler = (transferToDelete) => {
    const updateTransferLog = () => {
      const updatedTransferLog = transferLog.filter(
        (expense) => expense.id !== transferToDelete.id
      );

      setTransferLog(updatedTransferLog);
    };
    updateTransferLog();

    // close the delete modal
    setShowModal(false);

    const deleteTransferFromDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers/${transferToDelete.id}.json`,
        {
          method: "DELETE",
        }
      );
    };
    deleteTransferFromDB();

    const updateAccountBalance = async (fromOrTo) => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);

      const updateBalanceInDB = () => {
        let accountName;
        fromOrTo === "From"
          ? (accountName = transferToDelete.From)
          : (accountName = transferToDelete.To);

        const account = fetchedDataList.filter(
          (account) => account.Name === accountName
        );

        let updatedAccount;
        fromOrTo === "From"
          ? (updatedAccount = {
              Balance:
                Number(account[0].Balance) + Number(transferToDelete.Amount),
            })
          : (updatedAccount = {
              Balance:
                Number(account[0].Balance) - Number(transferToDelete.Amount),
            });
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
    updateAccountBalance("From");
    updateAccountBalance("To");
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
