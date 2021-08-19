import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import IncomeForm from "../Income/IncomeForm";
import IncomeLog from "../Income/IncomeLog";

const Income = (props) => {
  const [incomeFormShow, setIncomeFormShow] = useState(false);

  const [updatedIncomeLog, setUpdatedIncomeLog] = useState(false);

  const showIncomeFormHandler = () => {
    setIncomeFormShow((prevState) => !prevState);
  };

  const updateIncomeLogHandler = () => {
    setUpdatedIncomeLog((prevState) => !prevState);
  };

  const incomeForm = (
    <Grid item xs={12}>
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
        {incomeFormShow && (
          <IncomeForm
            updateIncomeLog={updateIncomeLogHandler}
            updateHomeHandler={props.updateHomeHandler}
          />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      {props.showIncomeForm && incomeForm}
      <Grid item xs={12}>
        {props.showIncomeLog && (
          <IncomeLog
            sliceLog={props.sliceLog}
            updatedIncomeLog={updatedIncomeLog}
            updateIncomeLog={updateIncomeLogHandler}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Income;
