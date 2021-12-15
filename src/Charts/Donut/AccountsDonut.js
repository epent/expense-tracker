import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Donut from "./Donut";
import { getDataFromDBasList as getAccountsFromDB } from "../../modules/fetch";

const AccountsDonut = (props) => {
  const [accountBalances, setAccountBalances] = useState([]);

  const [accountLabels, setAccountLabels] = useState([]);

  const [updateDonut, setUpdateDonut] = useState(false);

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
      const fetchAccounts = async () => {
        const accountList = await getAccountsFromDB("accounts");

        const updateState = async () => {
          const fetchedAccountBalances = accountList.map((account) => {
            return Number(account.Balance);
          });

          const fetchedAccountLabels = accountList.map((account) => {
            return account.Name;
          });

          setAccountBalances(fetchedAccountBalances);

          setAccountLabels(fetchedAccountLabels);

          setUpdateDonut((prevState) => !prevState);
        };
        await updateState();
      };
      await fetchAccounts();
    };
    updateAccounts();
  }, [props.updateAccounts, props.updateHome]);

  return (
    <Box mt={2}>
      <Donut
        labels={[]}
        data={[]}
        updatedLabels={accountLabels}
        updatedData={accountBalances}
        updateDonut={updateDonut}
        colors={colors}
      />
    </Box>
  );
};

export default AccountsDonut;
