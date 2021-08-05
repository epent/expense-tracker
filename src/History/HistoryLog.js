import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import ExpenseLog from "../Expenses/ExpenseLog";
import IncomeLog from "../Income/IncomeLog";
import TransferLog from "../Transfers/TransferLog";

const HistoryLog = (props) => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom color="textSecondary">
        History
      </Typography>
      <ExpenseLog />
      <IncomeLog />
      <TransferLog />
    </Box>
  );
};

export default HistoryLog;
