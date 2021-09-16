import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import AccountHistory from "./AccountHistory";
import {
  fetchAccountsFromDB,
  deleteTransactionFromDB as deleteAccountFromDB,
} from "../modules/fetch";

const AccountLog = (props) => {
  const [accountLog, setAccountLog] = useState([]);

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
    // fetch accountList from server
    const fetchAccounts = async () => {
      const accountList = await fetchAccountsFromDB();

      setAccountLog(accountList);
    };
    fetchAccounts();
  }, [props.updatedAccountLog, props.updateHome]);

  const deleteAccountHandler = (accountId) => {
    deleteAccountFromDB("accounts", accountId);

    const updateAccountLog = () => {
      const updatedExpenseLog = accountLog.filter(
        (expense) => expense.id !== accountId
      );

      setAccountLog(updatedExpenseLog);
    };
    updateAccountLog();
  };

  const editAccountHandler = (account) => {
    setAccountForm({
      Name: account.Name,
      Category: account.Category,
      Balance: account.Balance,
    });

    setEditedAccountId(account.id);

    if (editedAccountId === account.id) {
      setShowAccountForm((prevState) => !prevState);
    }
  };

  let accounts = accountLog;
  if (props.sliceLog) accounts = accountLog.slice(0, 8);

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
