import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  getDataFromDB,
  deleteTransactionFromDB,
} from "../modules/fetch";

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

  const fetchDataToList = async (urlName, isTotal) => {
    const pushFetchedDataToList = (data) => {
      const list = [];
      if (data) {
        isTotal
          ? Object.keys(data).map((key) => {
              list.push({
                [key]: data[key],
                id: key,
              });
            })
          : Object.keys(data).map((key) => {
              list.push({
                ...data[key],
                id: key,
              });
            });
      }
      return list;
    };

    const fetchedData = await getDataFromDB(urlName);
    const fetchedDataList = pushFetchedDataToList(fetchedData);
    return fetchedDataList;
  };

  useEffect(() => {
    const fetchTransferLog = async () => {
      const fetchedTransfersList = await fetchDataToList("transfers");
      fetchedTransfersList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setTransferLog(fetchedTransfersList);
    };
    fetchTransferLog();
  }, [props.updatedTransferLog, props.updateHome]);

  const deleteTransferHandler = (transferToDelete) => {
    deleteTransactionFromDB("transfers", transferToDelete.id);

    const updateTransferLog = () => {
      const updatedTransferLog = transferLog.filter(
        (expense) => expense.id !== transferToDelete.id
      );

      setTransferLog(updatedTransferLog);
    };
    updateTransferLog();

    // close the delete modal
    setShowModal(false);

    const updateData = async () => {
      const updateAccountBalance = async (fromOrTo) => {
        const fetchedAccountList = await fetchDataToList("accounts");

        const updateBalanceInDB = async () => {
          let accountName;
          fromOrTo === "From"
            ? (accountName = transferToDelete.From)
            : (accountName = transferToDelete.To);

          const account = fetchedAccountList.filter(
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

          await postUpdatedBalance("accounts", accountId, updatedAccount);
        };
        await updateBalanceInDB();
      };
      await updateAccountBalance("From");
      await updateAccountBalance("To");

      const triggerPageUpdates = async () => {
        // trigger Home to rerender with updated accountLog/categoryLog
        if (props.updateHomeHandler) await props.updateHomeHandler();
      };
      await triggerPageUpdates();
    };
    updateData();
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
      />
    </Box>
  );
};

export default TransferLog;
