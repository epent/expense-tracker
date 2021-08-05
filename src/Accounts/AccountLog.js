import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import AccountHistory from "./AccountHistory";

const AccountLog = () => {
  const [accountLog, setAccountLog] = useState({
    accountList: [],
  });

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

        console.log(fetchedList);
      });
  }, []);

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
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
        accountId +
        ".json",
      {
        method: "DELETE",
      }
    );
  };

  return (
    <Box>
      <AccountHistory
        accounts={accountLog.accountList}
        deleteAccount={deleteAccountHandler}
      />
    </Box>
  );
};

export default AccountLog;
