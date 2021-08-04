import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Expenses from "../Expenses";
import Income from "../Income";
import Accounts from "../Accounts";
import Transfers from "../Transfers";

const Transactions = () => {
  return (
    <Box>
      <Expenses />
      <Income />
      <Accounts />
      <Transfers />
    </Box>
  );
};

export default Transactions;
