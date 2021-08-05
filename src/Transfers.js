import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import TransferForm from "./Transfers/TransferForm";
import TransferLog from "./Transfers/TransferLog";

const Transfers = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom color="textSecondary">
        Transfer
      </Typography>
      <TransferForm />
      <TransferLog />
    </Box>
  );
};

export default Transfers;
