import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import IncomeForm from "../Income/IncomeForm";
import IncomeLog from "../Income/IncomeLog";

const Income = (props) => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom color="primary">
        Income
      </Typography>
      <IncomeForm />
      <IncomeLog />
    </Box>
  );
};

export default Income;
