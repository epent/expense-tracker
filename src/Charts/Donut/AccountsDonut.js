import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

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
      const accountList = props.accountList;

      const balances = accountList.map((account) => {
        return Number(account.Balance);
      });

      const labels = accountList.map((account) => {
        return account.Name;
      });

      setAccountBalances(balances);

      setAccountLabels(labels);
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
