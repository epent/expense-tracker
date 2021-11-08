import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import TransactionForm from "../components/Forms/TransactionForm";
import TransactionList from "../components/History/TransactionList";

const NewExpenses = () => {
  return (
    <Box m={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TransactionForm showButtonGroup={false} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewExpenses;
