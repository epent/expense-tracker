import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import AccountForm from "../Accounts/AccountForm";
import AccountLog from "../Accounts/AccountLog";

const Accounts = (props) => {
  const [accountFormShow, setAccountFormShow] = useState(false);

  const [updatedAccountLog, setUpdatedAccountLog] = useState(false);

  // show the form when toggle "+Accounts" button
  const showAccountFormHandler = () => {
    setAccountFormShow((prevState) => !prevState);
  };

  // update the list of accounts
  const updateAccountLogHandler = () => {
    setUpdatedAccountLog((prevState) => !prevState);
  };

  const accountForm = (
    <Grid item xs={12}>
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
        {accountFormShow && (
          <AccountForm updateAccountLog={updateAccountLogHandler} />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      {props.showAccountForm && accountForm}
      <Grid item xs={12}>
        <AccountLog
          sliceLog={props.sliceLog}
          showEditBtn={props.showEditBtn}
          showDeleteBtn={props.showDeleteBtn}
          updatedAccountLog={updatedAccountLog}
          updateAccountLog={updateAccountLogHandler}
          updateHome={props.updateHome}
        />
      </Grid>
    </Grid>
  );
};

export default Accounts;
