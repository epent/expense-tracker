import React from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

const Form = (props) => {
  const classes = useStyles();

  let formValues = props.form;
  // if we edit any transaction, shown form changes
  if (props.showEditedForm) formValues = props.editedForm;

  let form = Object.keys(formValues).map((formKey) => {
    return formKey === "Date" ? (
      <Grid item key={formKey}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            inputVariant="outlined"
            label={formKey}
            margin="normal"
            size="small"
            className={classes.root}
            value={props.selectedDate}
            onChange={(date) => props.handleDateChange(date)}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    ) : (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </Grid>
    );
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler}>
        {form}
        <Button type="submit" variant="contained" color={props.btnColor}>
          {props.btnName}
        </Button>
      </form>
    </Grid>
  );
};

export default Form;
