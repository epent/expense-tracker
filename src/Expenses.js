import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import ExpenseForm from "./Expenses/ExpenseForm";
import ExpenseLog from "./Expenses/ExpenseLog";

const Expenses = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom color="secondary">
        Expenses
      </Typography>
      <ExpenseForm />
      <ExpenseLog />
    </Box>
  );
};

export default Expenses;
