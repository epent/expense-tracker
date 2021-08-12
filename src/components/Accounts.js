import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import AccountForm from "../Accounts/AccountForm";
import AccountLog from "../Accounts/AccountLog";

const Accounts = () => {
  const [showAccountForm, setShowAccountForm] = useState(false);

  const showAccountFormHandler = () => {
    setShowAccountForm((prevState) => !prevState);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddBoxIcon />}
          onClick={showAccountFormHandler}
        >
          Accounts
        </Button>
      </Grid>
      <Grid item xs={12}>
        {showAccountForm && <AccountForm />}
      </Grid>
      <Grid item xs={12}>
        <AccountLog showEditBtn={true} showDeleteBtn={true} />
      </Grid>
    </Grid>
  );
};

export default Accounts;
