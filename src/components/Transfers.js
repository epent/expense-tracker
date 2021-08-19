import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import TransferForm from "../Transfers/TransferForm";
import TransferLog from "../Transfers/TransferLog";

const Transfers = (props) => {
  const [transferFormShow, setTransferFormShow] = useState(false);

  const [updatedTransferLog, setUpdatedTransferLog] = useState(false);

  const showTransferFormHandler = () => {
    setTransferFormShow((prevState) => !prevState);
  };

  const updateTransferLogHandler = () => {
    setUpdatedTransferLog((prevState) => !prevState);
  };

  const transferForm = (
    <Grid item xs={12}>
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
        {transferFormShow && (
          <TransferForm updateTransferLog={updateTransferLogHandler} />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      {props.showTransferForm && transferForm}
      <Grid item xs={12}>
        {props.showTransferLog && (
          <TransferLog
            updatedTransferLog={updatedTransferLog}
            updateTransferLog={updateTransferLogHandler}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Transfers;
