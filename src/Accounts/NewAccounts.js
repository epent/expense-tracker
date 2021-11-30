import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import NewAccountForm from "./NewAccountForm";
import AccountPaper from "./AccountPaper";

const NewAccounts = (props) => {
  const [updateAccounts, setUpdateAccounts] = useState(false);

  // update the list of accounts
  const updateAccountsHandler = () => {
    setUpdateAccounts((prevState) => !prevState);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <NewAccountForm
          pageTitle="Add new account"
          updateAccountsHandler={updateAccountsHandler}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <AccountPaper updateAccounts={updateAccounts} />
      </Grid>
    </Grid>
  );
};

export default NewAccounts;
