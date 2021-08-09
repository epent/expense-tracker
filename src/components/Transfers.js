import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import TransferForm from "../Transfers/TransferForm";
import TransferLog from "../Transfers/TransferLog";

const Transfers = (props) => {
  const [showTransferForm, setShowTransferForm] = useState(false);

  const showTransferFormHandler = () => {
    setShowTransferForm((prevState) => !prevState);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          onClick={showTransferFormHandler}
        >
          Transfers
        </Button>
      </Grid>
      <Grid item xs={12}>
        {showTransferForm && <TransferForm />}
      </Grid>
      <Grid item xs={12}>
        {props.showTransferLog && <TransferLog />}
      </Grid>
    </Grid>
  );
};

export default Transfers;
