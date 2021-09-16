import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";
import {
  postUpdatedBalance,
  postUpdatedTotal,
  getDataFromDB,
  deleteTransactionFromDB,
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
    const fetchIncomeLog = async () => {
      const fetchedIncomeList = await fetchDataToList("income");
      fetchedIncomeList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setIncomeLog(fetchedIncomeList);
    };
    fetchIncomeLog();
  }, [props.updatedIncomeLog, props.updateHome]);

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

          const updatedTotals = {
            income:
              Number(totalIncome[0].income) - Number(incometoDelete.Amount),
          };

          await postUpdatedTotal(updatedTotals);
        };
        await updateBalanceInDB();
      };
      await updateTotalBalance();

      const triggerPageUpdates = async () => {
        // trigger Home to rerender with updated accountLog/categoryLog
        if (props.updateHomeHandler) await props.updateHomeHandler();
      };
      await triggerPageUpdates();
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
      />
    </Box>
  );
};

export default IncomeLog;
