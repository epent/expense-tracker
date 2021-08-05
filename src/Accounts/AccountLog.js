import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import AccountHistory from "./AccountHistory";

const AccountLog = () => {
  const [accountLog, setAccountLog] = useState({
    accountList: [],
    loading: true,
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
          loading: false,
        });

        console.log(fetchedList);
      });
  }, []);

  return (
    <Box>
      <AccountHistory accounts={accountLog.accountList} />
    </Box>
  );
};

export default AccountLog;
