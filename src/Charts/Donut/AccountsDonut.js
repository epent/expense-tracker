import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import Donut from "./Donut";

const AccountsDonut = (props) => {
  const [accountBalances, setAccountBalances] = useState([]);

  const [accountLabels, setAccountLabels] = useState([]);

  const colors = [
    "#26a69a",
    "#b2dfdb",
    "#80cbc4",
    "#009688",
    "#00796b",
    "#004d40",
  ];

  useEffect(() => {
    const updateAccounts = async () => {
      let accountList;
      if (props.accountList && props.accountList.length > 0) {
        accountList = props.accountList;

        const balances = accountList.map((account) => {
          return Number(account.balance);
        });

        const labels = accountList.map((account) => {
          return account.name;
        });

        setAccountBalances(balances);

        setAccountLabels(labels);
      }
    };
    updateAccounts();
  }, [props.accountList]);

  return (
    <Box mt={2}>
      <Donut
        labels={[]}
        data={[]}
        updatedLabels={accountLabels}
        updatedData={accountBalances}
        colors={colors}
      />
    </Box>
  );
};

export default AccountsDonut;
