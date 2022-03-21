import React, { useState } from "react";

import Grid from "@mui/material/Grid";

import AccountForm from "./AccountForm";
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
        <AccountForm
          pageTitle="Add new account"
          updateAccountsHandler={updateAccountsHandler}
          openErrorDialog={props.openErrorDialog}
          token={props.token}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <AccountPaper
          updateAccounts={updateAccounts}
          title="List of accounts"
          token={props.token}
        />
      </Grid>
    </Grid>
  );
};

export default NewAccounts;
