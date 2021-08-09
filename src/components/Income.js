import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import IncomeForm from "../Income/IncomeForm";
import IncomeLog from "../Income/IncomeLog";

const Income = () => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const showIncomeFormHandler = () => {
    setShowIncomeForm((prevState) => !prevState);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={showIncomeFormHandler}
        >
          Income
        </Button>
      </Grid>
      <Grid item xs={12}>
        {showIncomeForm && <IncomeForm />}
      </Grid>
      <Grid item xs={12}>
        <IncomeLog />
      </Grid>
    </Grid>
  );
};

export default Income;
