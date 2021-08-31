import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import History from "../components/History/History";

const ExpenseLog = (props) => {
  const [expenseLog, setExpenseLog] = useState([]);

  const [expenseForm, setExpenseForm] = useState({
    From: "",
    To: "",
    Amount: "",
    Date: new Date(),
    Comment: "",
  });

  //  id of the expense we want to edit
  const [editedExpenseId, setEditedExpenseId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // needed for modal when deleting transaction
  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState("");

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
    const fetchExpenseLog = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);
      fetchedDataList.sort(
        (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      setExpenseLog(fetchedDataList);
    };
    fetchExpenseLog();
  }, [props.updatedExpenseLog, props.updateHome]);

  const deleteExpenseHandler = (expenseToDelete) => {
    const updateExpenseLog = () => {
      const updatedExpenseLog = expenseLog.filter(
        (expense) => expense.id !== expenseToDelete.id
      );
      setExpenseLog(updatedExpenseLog);
    };
    updateExpenseLog();

    // close the delete modal
    setShowModal(false);

    const deleteExpenseFromDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses/${expenseToDelete.id}.json`,
        {
          method: "DELETE",
        }
      );
    };
    deleteExpenseFromDB();

    const updateAccountBalance = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);

      const updateBalanceinDB = () => {
        const account = fetchedDataList.filter(
          (account) => account.Name === expenseToDelete.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(expenseToDelete.Amount),
        };
        const accountId = account[0].id;

        fetch(
          `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/${accountId}.json`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      };
      updateBalanceinDB();
    };
    updateAccountBalance();

    const updateCategoryBalance = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
      );
      const fetchedData = await response.json();
      const fetchedDataList = pushFetchedDataToList(fetchedData);

      const updateBalanceinDB = () => {
        const category = fetchedDataList.filter(
          (category) => category.Name === expenseToDelete.To
        );
        const updatedCategory = {
          Balance: Number(category[0].Balance) - Number(expenseToDelete.Amount),
        };
        const categoryId = category[0].id;

        fetch(
          `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/${categoryId}.json`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedCategory),
          }
        ).then((response) => {
          if (props.updateHomeHandler) props.updateHomeHandler();
        });
      };
      updateBalanceinDB();
    };
    updateCategoryBalance();

    // fetch totalBalances from server
    const updateTotalBalance = async () => {
      const response = await fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
      );
      const fetchedData = await response.json();
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

      const updateBalanceinDB = () => {
        const totalExpenses = fetchedDataList.filter((total) => {
          return total.id === "expenses";
        });

        // const totalIncome = fetchedDataList.filter((total) => {
        //   return total.id === "income";
        // });

        // const totalBalance = fetchedDataList.filter((total) => {
        //   return total.id === "balance";
        // });

        const updatedTotals = {
          expenses:
            Number(totalExpenses[0].expenses) - Number(expenseToDelete.Amount),
        };

        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedTotals),
          }
        );
      };
      updateBalanceinDB();
    };
    updateTotalBalance();
  };

  const editExpenseHandler = (expense) => {
    setExpenseForm({
      From: expense.From,
      To: expense.To,
      Amount: expense.Amount,
      Date: expense.Date,
      Comment: expense.Comment,
    });

    setEditedExpenseId(expense.id);

    if (editedExpenseId === expense.id) {
      setShowExpenseForm((prevState) => !prevState);
      props.setEditExpenseFormShow();
    }
  };

  const openModalHandler = (transaction) => {
    setShowModal(true);
    setExpenseToDelete(transaction);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  let transactions = expenseLog;
  if (props.sliceLog) transactions = expenseLog.slice(0, 4);

  return (
    <Box>
      <History
        transactions={transactions}
        transactionColor="secondary"
        arrowColor="secondary"
        amountColor="secondary"
        sign="-"
        deleteTransaction={deleteExpenseHandler}
        editTransaction={editExpenseHandler}
        expenseForm={expenseForm}
        showExpenseForm={showExpenseForm}
        editedExpenseId={editedExpenseId}
        setShowExpenseForm={setShowExpenseForm}
        updateExpenseLog={props.updateExpenseLog}
        openModal={openModalHandler}
        closeModal={closeModalHandler}
        showModal={showModal}
        transactionToDelete={expenseToDelete}
        updateHomeHandler={props.updateHomeHandler}
        accountList={props.accountList}
        categoryList={props.categoryList}
      />
    </Box>
  );
};

export default ExpenseLog;
