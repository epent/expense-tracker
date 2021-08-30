import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import AccountHistory from "./AccountHistory";

const AccountLog = (props) => {
  const [accountLog, setAccountLog] = useState({
    accountList: [],
  });

  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: 0,
  });

  //  id of the account we want to edit
  const [editedAccountId, setEditedAccountId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showAccountForm, setShowAccountForm] = useState(false);

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        setAccountLog({
          ...accountLog,
          accountList: fetchedList,
        });
      });
  }, [props.updatedAccountLog, props.updateHome]);

  const deleteAccountHandler = (accountId) => {
    const updatedExpenseLog = accountLog.accountList.filter(
      (expense) => expense.id !== accountId
    );

    setAccountLog({
      ...accountLog,
      accountList: updatedExpenseLog,
    });

    // delete account from db
    fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/${accountId}.json`,
      {
        method: "DELETE",
      }
    );
  };

  const editAccountHandler = (
    accountId,
    accountName,
    accountCategory,
    accountBalance
  ) => {
    setAccountForm({
      Name: accountName,
      Category: accountCategory,
      Balance: accountBalance,
    });

    setEditedAccountId(accountId);

    if (editedAccountId === accountId) {
      setShowAccountForm((prevState) => !prevState);
    }
  };

  let accounts = accountLog.accountList;
  if (props.sliceLog) accounts = accountLog.accountList.slice(0, 8);

  return (
    <Box>
      <AccountHistory
        accounts={accounts}
        deleteAccount={deleteAccountHandler}
        editAccount={editAccountHandler}
        accountForm={accountForm}
        showAccountForm={showAccountForm}
        editedAccountId={editedAccountId}
        setShowAccountForm={setShowAccountForm}
        showEditBtn={props.showEditBtn}
        showDeleteBtn={props.showDeleteBtn}
        updateAccountLog={props.updateAccountLog}
      />
    </Box>
  );
};

export default AccountLog;
